import { DBConnection } from "../../interfaces/DBConnection";
import { Order } from "../entities/order";
import { CreateOrderRequestDTO } from "../interfaces/dtos";
import { OrderRepository } from "../interfaces/repositories";

export class OrderGateway implements OrderRepository {
  private readonly ORDER_TABLE_NAME = "orders";
  private readonly ORDER_ITEM_TABLE_NAME = "order_items";
  private dbConnection: DBConnection<Order>;

  constructor(dbConnection: DBConnection<any>) {
    this.dbConnection = dbConnection;
  }

  async createOrder(
    order: CreateOrderRequestDTO & { totalPrice: number }
  ): Promise<Order | null> {
    const orderData = {
      orderDate: order.orderDate,
      status: order.status,
      code: order.code,
      paymentStatus: "PENDING",
      items: order.items.map((item) => ({
        quantity: item.quantity,
        price: item.price,
        product: { id: item.productId },
      })),
    };

    const result = await this.dbConnection.save(
      this.ORDER_TABLE_NAME,
      orderData
    );

    return Order.create(
      result?.id,
      result?.orderDate,
      result?.status,
      result?.items,
      order.totalPrice,
      result?.code,
      result?.paymentStatus
    );
  }

  async listOrders(): Promise<Order[] | null> {
    const result = await this.dbConnection.findWithOrder(
      this.ORDER_TABLE_NAME,
      {
        orderBy: [
          {
            field: "status",
            direction: "ASC",
            customOrder: { PRONTO: 1, PREPARACAO: 2, RECEBIDO: 3 },
          },
          { field: "orderDate", direction: "ASC" },
        ],
        relations: ["items"],
      }
    );

    return result
      .map((order) => {
        const items = order.items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        }));

        const totalPrice = items?.reduce((acc: number, item: any) => {
          return acc + item.price * item.quantity;
        }, 0);

        return Order.create(
          order?.id,
          order?.orderDate,
          order?.status,
          items,
          totalPrice,
          order?.code,
          order?.paymentStatus
        );
      })
      .filter((order): order is Order => order !== null);
  }

  async findOrder(id: number): Promise<Order | null> {
    const result = await this.dbConnection.findOne(
      this.ORDER_TABLE_NAME,
      {
        id,
      },
      ["items"]
    );

    const items = result?.items.map((item: any) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalPrice = items?.reduce((acc: number, item: any) => {
      return acc + item.price * item.quantity;
    }, 0);

    return Order.create(
      result?.id,
      result?.orderDate,
      result?.status,
      items,
      totalPrice,
      result?.code,
      result?.paymentStatus
    );
  }

  async findByCode(code: string): Promise<Order | null> {
    const result = await this.dbConnection.findOne(
      this.ORDER_TABLE_NAME,
      {
        code,
      },
      ["items"]
    );

    const items = result?.items.map((item: any) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalPrice = items?.reduce((acc: number, item: any) => {
      return acc + item.price * item.quantity;
    }, 0);

    return Order.create(
      result?.id,
      result?.orderDate,
      result?.status,
      items,
      totalPrice,
      result?.code,
      result?.paymentStatus
    );
  }

  async updateOrderStatus(id: number, status: string): Promise<void> {
    await this.dbConnection.update(this.ORDER_TABLE_NAME, { id }, { status });
  }

  async updatePaymentStatus(id: number, paymentStatus: string): Promise<void> {
    await this.dbConnection.update(
      this.ORDER_TABLE_NAME,
      { id },
      { paymentStatus }
    );
  }
}
