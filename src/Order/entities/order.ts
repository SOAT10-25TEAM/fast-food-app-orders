import { OrderItem } from "./orderItem";

export class Order {
  private _id: number;
  private _orderDate: Date;
  private _status: string;
  private _items: OrderItem[];
  private _totalPrice: number;
  private _code: string;
  private _paymentStatus: string;

  private constructor(
    id: number,
    orderDate: Date,
    status: string,
    items: OrderItem[],
    totalPrice: number,
    code: string,
    paymentStatus: string
  ) {
    this._id = id;
    this._orderDate = orderDate;
    this._status = status;
    this._items = items;
    this._totalPrice = totalPrice;
    this._code = code;
    this._paymentStatus = paymentStatus;
  }

  static create(
    id?: number,
    orderDate?: Date,
    status?: string,
    items?: OrderItem[],
    totalPrice?: number,
    code?: string,
    paymentStatus: string = "PENDING"
  ): Order | null {
    if (!id || !orderDate || !status || !items || !totalPrice || !code) {
      return null;
    }
    return new Order(
      id,
      orderDate,
      status,
      items,
      totalPrice,
      code,
      paymentStatus
    );
  }

  get id(): number {
    return this._id;
  }
  get code(): string {
    return this._code;
  }
  get orderDate(): Date {
    return this._orderDate;
  }
  get status(): string {
    return this._status;
  }
  get items(): OrderItem[] {
    return this._items;
  }
  get totalPrice(): number {
    return this._totalPrice;
  }
  get paymentStatus(): string {
    return this._paymentStatus;
  }
}
