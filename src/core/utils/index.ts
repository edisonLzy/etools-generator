import path from 'path';
export function resolvePath(workinDir: string) {
  return (p: string) => path.resolve(workinDir, p);
}

export function resolveCwd(p: string) {
  return resolvePath(process.cwd())(p);
}
