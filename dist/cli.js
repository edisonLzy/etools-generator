#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const update_notifier_1 = __importDefault(require("update-notifier"));
const commander_1 = require("commander");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');
(0, update_notifier_1.default)({ pkg }).notify();
commander_1.program
    .version(pkg.version)
    .description('🚀 quickly build cms crud module')
    .usage('[options]')
    .requiredOption('-m,--mid <mid>', '😊 模块名称')
    .option('-p,--project [project]', '😄 配置文件目录')
    .option('-c,--cwd [cwd]', '😁 工作目录')
    .action(async (args) => {
    console.log(args);
})
    .parse(process.argv);
//# sourceMappingURL=cli.js.map