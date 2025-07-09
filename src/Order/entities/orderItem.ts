export class OrderItem {
  private _id: number;
  private _productId: number;
  private _quantity: number;
  private _price: number;

  private constructor(
    id: number,
    productId: number,
    quantity: number,
    price: number
  ) {
    this._id = id;
    this._productId = productId;
    this._quantity = quantity;
    this._price = price;
  }

  static create(
    id?: number,
    productId?: number,
    quantity?: number,
    price?: number
  ): OrderItem | null {
    if (!id || !productId || !quantity || !price) {
      return null;
    }
    return new OrderItem(id, productId, quantity, price);
  }

  get id(): number {
    return this._id;
  }
  get productId(): number {
    return this._productId;
  }
  get quantity(): number {
    return this._quantity;
  }
  get price(): number {
    return this._price;
  }
}
