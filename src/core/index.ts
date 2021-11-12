import resolveCwd from 'resolve-cwd';
import { GeneratorOptions } from '@/types';
export function generator(op: GeneratorOptions) {
  const { configFile, outputDir, mid } = op;
  console.log(resolveCwd(configFile));
  return op;
}
