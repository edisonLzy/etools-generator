// 用于收集产物
import fs from 'fs-extra';
import { ConfigFileOptions, Product } from '../types';
type Mid = ConfigFileOptions['mid'];
export class Collector {
  private collection = new Map<Mid, Product[]>();
  collect(mid: Mid, products: Product[]) {
    //  从缓存文件中读取
    if (this.collection.has(mid)) {
      const _products = this.collection.get(mid) ?? [];
      this.collection.set(mid, products.concat(_products));
      return;
    }
    this.collection.set(mid, products);
  }
  clear(mid: Mid) {
    const products = this.collection.get(mid) ?? [];
    const clearPaths = products.map((p) => p.outPath);
  }
  async output(mid: Mid) {
    const products = this.collection.get(mid) ?? [];
    for (const product of products) {
      const { content, outPath } = product;
      await fs.outputFile(outPath, content);
    }
    return products.map((p) => p.outPath);
  }
}
