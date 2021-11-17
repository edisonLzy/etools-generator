import { parse, traverse } from '@babel/core';
import { TraverseOptions } from '@babel/traverse';
import fs from 'fs-extra';
import generator from '@babel/generator';
export function transformFile(filePath: string, traverseOp: TraverseOptions) {
  const code = fs.readFileSync(filePath);
  const ast = parse(code.toString(), {
    sourceType: 'unambiguous',
    plugins: [
      [
        require.resolve('@babel/plugin-transform-typescript'),
        {
          isTSX: true,
        },
      ],
    ],
  });
  traverse(ast, traverseOp);
  const result = generator(ast!);
  fs.outputFileSync(filePath, result.code);
}
