export class Product {
  private _id: number;
  private _name: string;
  private _price: number;
  private _description: string;
  private _image: string;
  private _categoryId: number;

  private constructor(
    id: number,
    name: string,
    price: number,
    description: string,
    image: string,
    categoryId: number
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._description = description;
    this._image = image;
    this._categoryId = categoryId;
  }

  static create(
    id?: number,
    name?: string,
    price?: number,
    description?: string,
    image?: string,
    categoryId?: number
  ): Product | null {
    if (!id || !name || !price || !description || !image || !categoryId) {
      return null;
    }
    return new Product(id, name, price, description, image, categoryId);
  }

  get id(): number {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get price(): number {
    return this._price;
  }
  get description(): string {
    return this._description;
  }
  get image(): string {
    return this._image;
  }
  get categoryId(): number {
    return this._categoryId;
  }
}
