import { Order } from "../entities/order";
import { CreateOrderRequestDTO } from "./dtos";

export interface OrderRepository {
  createOrder(
    order: CreateOrderRequestDTO & { totalPrice: number }
  ): Promise<Order | null>;
  listOrders(): Promise<Order[] | null>;
  findOrder(id: number): Promise<Order | null>;
  updateOrderStatus(id: number, status: string): Promise<void>;
  updatePaymentStatus(id: number, paymentStatus: string): Promise<void>;
  findByCode(code: string): Promise<Order | null>;
}

export interface MockPaymentRepository {
  processPayment(
    orderId: number,
    paymentStatus: string,
    orderStatus: string
  ): Promise<{ success: boolean; message: string }>;
}
