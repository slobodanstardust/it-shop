export class Product {
  _id: string;
  category: string;
  brand: string;
  name: string;
  processor: string;
  memory: string;
  storage: string;
  display: string;
  price: number;
  imagePath: string;

  constructor (newObject: any) {
    this._id = newObject && newObject._id || '';
    this.category = newObject && newObject.category || '';
    this.brand = newObject && newObject.brand || '';
    this.name = newObject && newObject.name || '';
    this.processor = newObject && newObject.processor || '';
    this.memory = newObject && newObject.memory || '';
    this.storage = newObject && newObject.storage || '';
    this.display = newObject && newObject.display || '';
    this.price  = newObject && newObject.price || null;
    this.imagePath  = newObject && newObject.imagePath || '';
  }
}
