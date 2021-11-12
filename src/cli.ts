#!/usr/bin/env node
import updateNotifier from 'update-notifier';
import path from 'path';
import { program } from 'commander';
import { generator } from './core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');
updateNotifier({ pkg }).notify();
program
  .version(pkg.version)
  .description('🚀 quickly build cms crud module')
  .usage('[options]')
  .requiredOption('-m,--mid <mid>', '😊 模块名称')
  .option('-f,--configFile [configFile]', '😄 配置文件')
  .option('-c,--cwd [cwd]', '😁 工作目录')
  .action(async (args) => {
    const { mid, configFile, cwd } = args;
    await generator({
      mid,
      configFile,
      cwd,
      outputDir: {},
    });
  })
  .parse(process.argv);
