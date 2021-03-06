import { Product } from './product';

export class ProductsData {
  page: number;
  pageSize: number;
  pageCount: number;
  count: number;
  products: Product[];

  constructor (newObject: any) {
    this.page = newObject && newObject.page || null;
    this.pageSize = newObject && newObject.pageSize || null;
    this.pageCount = newObject && newObject.pageCount || null;
    this.count = newObject && newObject.count || null;
    this.products = newObject && newObject.products.map((item: any) => new Product(item)) || [];
  }
}
