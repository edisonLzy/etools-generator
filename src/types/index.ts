export type OutputDirConfig = Record<string, string>;
export interface GeneratorOptions {
  /**
   * @type {string}
   * @description 模块id
   * @memberOf GeneratorOptions
   */
  mid: string;
  /**
   * @type {string}
   * @description 配置文件
   * @memberOf GeneratorOptions
   */
  configFile: string;
  /**
   * @type {string}
   * @description 工作目录
   * @memberOf GeneratorOptions
   */
  cwd: string;
  /**
   * @type {OutputDir}
   * @description 输出目录配置
   * @memberOf GeneratorOptions
   */
  outputDir: OutputDirConfig;
}
