"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generator = void 0;
const resolve_cwd_1 = __importDefault(require("resolve-cwd"));
function generator(op) {
    const { configFile, outputDir, mid } = op;
    console.log((0, resolve_cwd_1.default)(configFile));
    return op;
}
exports.generator = generator;
//# sourceMappingURL=index.js.map