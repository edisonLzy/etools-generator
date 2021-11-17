#!/usr/bin/env node
import updateNotifier from 'update-notifier';
import { program } from 'commander';
import { generator } from './core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');
updateNotifier({ pkg }).notify();
program
  .version(pkg.version)
  .description('🚀 quickly build cms crud module')
  .usage('[options]')
  .option('-f,--configFilePath [configFilePath]', '😄 配置文件')
  .option('-c,--cwd [cwd]', '😁 工作目录')
  .option('-t,--templatePath [templatePath]', '😁 模板目录')
  .option('-o,--outDir [outDir]', '😁 输出目录')
  .action(async (args) => {
    const { configFilePath, cwd, templatePath, outDir } = args;
    await generator({
      configFilePath,
      cwd,
      templatePath,
      outDir,
    });
  })
  .parse(process.argv);
