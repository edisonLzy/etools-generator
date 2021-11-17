import { transformFile } from '../utils/transform';

export type OutputDirConfig = Record<string, string>;
export interface GeneratorOptions {
  /**
   * @type {string}
   * @description 工作目录
   * @memberOf GeneratorOptions
   */
  cwd: string;
  /**
   * @description 模板路径
   * @type {string}
   * @memberof GeneratorOptions
   */
  templatePath: string;

  /**
   * @description 配置文件路径
   * @type {string}
   * @memberof GeneratorOptions
   */
  configFilePath: string;

  /**
   * @description 输出目录
   * @type {string}
   * @memberof GeneratorOptions
   */
  outDir: string;
}

export type Product = {
  /**
   * @description 根据模板渲染之后的内容
   * @type {string}
   */
  content: string;
  /**
   * @description 文件输出的路径
   * @type {string}
   */
  outPath: string;
};

export type SupportVariable = any;
export type ModuleName = string;
export type Variables = Record<string, SupportVariable>;
export type HookCtx = {
  transformFile: typeof transformFile;
  ctx: ConfigFileOptions;
};
export type Hook = (ctx: HookCtx) => void;
export type Module = {
  /**
   * @description 执行渲染意外的一些副作用
   * @type {Hook[]}
   */
  hooks?: Hook[];
  /**
   * @description 当前模块的变量集合
   * @type {Record<string, SupportVariable>}
   * @memberof Module
   */
  variables?: Variables;
};
export type Modules = Record<ModuleName, Module>;
export interface ConfigFileOptions {
  /**
   * @description 模块名称
   * @type {string}
   * @memberof ConfigFileOptions
   */
  mid: string;
  /**
   * @description 全局的变量集合
   * @type {Record<string, SupportVariable>}
   * @memberof ConfigFileOptions
   */
  variables?: Variables;
  /**
   * @description 功能模块配置
   * @type {Module}
   * @memberof ConfigFileOptions
   */
  modules?: Modules;
}
