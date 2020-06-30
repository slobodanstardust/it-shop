export class User {
  _id: string;
  username: string;
  password: string;

  constructor (newObject: any) {
    this._id = newObject && newObject._id || '';
    this.username = newObject && newObject.username || '';
    this.password = newObject && newObject.password || '';
  }
}
