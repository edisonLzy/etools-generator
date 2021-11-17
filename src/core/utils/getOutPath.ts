import path from 'path';
export function getOutPath({
  mid,
  fullPath,
  templatePath,
  outDir,
}: {
  mid: string;
  fullPath: string;
  templatePath: string;
  outDir: string;
}) {
  const relativePath = path.relative(templatePath, fullPath);
  const temp = path.join(outDir, relativePath);
  return temp.replace('mid', mid);
}
