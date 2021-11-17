import fg from 'fast-glob';
import path from 'path';
import { Listr } from 'listr2';
import ejs from 'ejs';
import fs from 'fs-extra';
import pMap from 'p-map';
import './utils/enhanceRequire';
import { internalConfigFile } from './template/configFile';
import { Collector } from './collector';
import { resolvePath } from './utils';
import { CONFIG_FILE, TEMPLATE_DIR, OUT_DIR } from './constant';
import { ConfigFileOptions, GeneratorOptions } from './types';
import { getOutPath } from './utils/getOutPath';
import { transformFile } from './utils/transform';

interface InternalState {
  configFileExist: boolean;
  configFilePath: string;
  templates: string[];
}

export async function generator(op: Partial<GeneratorOptions>) {
  const { cwd = process.cwd() } = op;
  const resolveCwd = resolvePath(cwd);
  const {
    configFilePath = resolveCwd(CONFIG_FILE),
    templatePath = resolveCwd(TEMPLATE_DIR),
    outDir = resolveCwd(OUT_DIR),
  } = op;
  const tasks = new Listr<
    {
      collector: Collector;
      configFile: ConfigFileOptions;
    } & InternalState &
      Pick<GeneratorOptions, 'templatePath' | 'cwd' | 'outDir'>
  >(
    [
      {
        title: '🚀 解析配置文件',
        task: async (ctx, task) => {
          return task.newListr([
            {
              title: '检查配置文件',
              async task(ctx) {
                const filePath = resolveCwd(CONFIG_FILE);
                const isExist = await fs.pathExists(filePath);
                ctx.configFileExist = isExist;
                ctx.configFilePath = filePath;
              },
            },
            {
              title: '正在生成预置的配置文件',
              skip: (ctx) => ctx.configFileExist,
              async task(ctx) {
                const { configFilePath } = ctx;
                await fs.outputFile(configFilePath, internalConfigFile);
                ctx.configFileExist = true;
                throw Error('😼 config has been output , please run again');
              },
            },
            {
              title: '加载配置文件',
              skip: (ctx) => !ctx.configFileExist,
              async task(ctx) {
                const { configFilePath } = ctx;
                const configFile = require(configFilePath);
                ctx.configFile = configFile.default ?? {};
              },
            },
          ]);
        },
      },
      {
        title: '🛸 解析模板目录',
        task: async (ctx, task) => {
          return task.newListr([
            {
              title: '检查模板目录',
              async task(ctx) {
                const { templatePath } = ctx;
                const isExist = await fs.pathExists(templatePath);
                if (!isExist) {
                  throw Error(`🥱 without template was found in 
                   ${templatePath}
                   `);
                }
                // 开始扫描template
                const templates = await fg(`${templatePath}/*`, {
                  onlyDirectories: true,
                });
                ctx.templates = templates;
              },
            },
            {
              title: '构建产物',
              async task(ctx, task) {
                const { templates, templatePath } = ctx;
                // 初始化 collector
                const modules = templates.map((template) => {
                  return path.relative(templatePath, template);
                });
                return task.newListr(
                  modules.map((module) => {
                    return {
                      title: `正在构建 ${module}`,
                      async task(ctx, task) {
                        const {
                          configFile: { variables, modules, mid },
                          collector,
                        } = ctx;
                        const files = await fg(
                          `${path.join(templatePath, module)}/**/*`,
                          {
                            onlyFiles: true,
                          }
                        );
                        // 获取 hooks
                        const hooks = modules?.[module]?.hooks ?? [];
                        // 获取变量
                        const localVariable =
                          modules?.[module]?.['variables'] ?? {};
                        const renderVariable = {
                          ...variables,
                          ...localVariable,
                          mid,
                        };
                        // 渲染module下面的所有文件
                        const products = await pMap(files, async (file) => {
                          const renderResult = await ejs.renderFile(
                            file,
                            renderVariable
                          );
                          const outPath = getOutPath({
                            mid,
                            fullPath: file,
                            templatePath,
                            outDir,
                          });
                          return {
                            outPath,
                            content: renderResult,
                          };
                        });
                        collector.collect(mid, products);
                        return task.newListr([
                          {
                            title: `正在执行 ${module} hooks`,
                            skip: () => hooks.length === 0,
                            async task(ctx) {
                              hooks.forEach((hook) => {
                                Reflect.apply(hook, null, [
                                  {
                                    transformFile,
                                  },
                                ]);
                              });
                            },
                          },
                        ]);
                      },
                    };
                  }),
                  {
                    concurrent: true,
                  }
                );
              },
            },
          ]);
        },
      },
      {
        title: '🚗 输出文件',
        async task(ctx, task) {
          const {
            collector,
            configFile: { mid },
          } = ctx;
          const paths = await collector.output(mid);
          task.output = JSON.stringify(paths);
        },
      },
    ],
    {
      concurrent: false,
      rendererOptions: {
        collapse: false,
        showSkipMessage: false,
      },
    }
  );
  try {
    await tasks.run({
      collector: new Collector(),
      templatePath: templatePath,
      configFileExist: false,
      configFilePath: configFilePath,
      cwd,
      configFile: {} as unknown as ConfigFileOptions,
      templates: [],
      outDir,
    });
  } catch (e) {
    console.error(e);
  }
}
