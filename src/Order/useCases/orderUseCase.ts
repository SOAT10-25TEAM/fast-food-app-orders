import { Order } from "../entities/order";
import { BusinessError } from "../../utils/errors";
import { CreateOrderRequestDTO, PaymentWebhookDTO } from "../interfaces/dtos";
import {
  MockPaymentRepository,
  OrderRepository,
} from "../interfaces/repositories";
import { getProductById } from "../../clients/products-api-client";
import { getUserById } from "../../clients/users-api-client";

export class OrderUseCase {
  static async createOrder(
    orderData: CreateOrderRequestDTO,
    repository: OrderRepository,
  ): Promise<Order | null> {
    try {
      const foundUser = await getUserById(orderData.userId);

      if (!foundUser) {
        throw new BusinessError("Cliente não encontrado!", 404);
      }

      const itemsArray: {
        productId: number;
        quantity: number;
        price: number;
      }[] = [];

      for (const item of orderData.items) {
        const foundProduct = await getProductById(item.productId);

        if (!foundProduct) {
          throw new BusinessError("Produto não encontrado!", 404);
        }
        itemsArray.push({
          productId: foundProduct.id,
          quantity: item.quantity,
          price: foundProduct.price,
        });
      }

      const totalPrice = itemsArray.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);

      return await repository.createOrder({
        orderDate: orderData.orderDate,
        status: orderData.status,
        items: itemsArray,
        totalPrice,
        code: orderData.code,
        userId: orderData.userId,
      });
    } catch (error) {
      throw error;
    }
  }
  
  static async listOrders(repository: OrderRepository): Promise<Order[]> {
    try {
      const orders = await repository.listOrders();

      if (!orders) {
        throw new BusinessError("Nenhum pedido encontrado!", 404);
      }

      const formmattedOrders = orders.filter((order) => {
        return order.status !== "FINALIZADO";
      });

      return formmattedOrders;
    } catch (error) {
      throw error;
    }
  }

  static async getPaymentStatus(
    code: string,
    repository: OrderRepository
  ): Promise<Order | null> {
    try {
      const order = await repository.findByCode(code);

      if (!order) {
        throw new BusinessError("Pedido não encontrado!", 404);
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  static async updateOrderStatus(
    updateData: { id: number; status: string },
    repository: OrderRepository
  ) {
    try {
      const order = await repository.findOrder(updateData.id);

      if (!order) {
        throw new BusinessError("Pedido não encontrado!", 404);
      }

      await repository.updateOrderStatus(updateData.id, updateData.status);
    } catch (error) {
      throw error;
    }
  }

  static async executePayment(
    {
      code,
      paymentStatus,
    }: { code: string; paymentStatus: "APPROVED" | "REJECTED" },
    paymentRepository: MockPaymentRepository,
    orderRepository: OrderRepository
  ) {
    try {
      const order = await orderRepository.findByCode(code);

      if (!order) {
        throw new BusinessError("Pedido não encontrado!", 404);
      }

      const messageReturn = await paymentRepository.processPayment(
        order.id,
        paymentStatus,
        order.status
      );

      if (!messageReturn.success) {
        throw new BusinessError(messageReturn.message, 400);
      }

      return messageReturn;
    } catch (error) {
      throw error;
    }
  }

  static async handlePaymentWebhook(
    repository: OrderRepository,
    paymentData: PaymentWebhookDTO
  ): Promise<void> {
    try {
      const { orderId, orderStatus, paymentStatus } = paymentData;

      if (paymentStatus === "REJECTED") {
        repository.updateOrderStatus(orderId, "FINALIZADO");
        repository.updatePaymentStatus(orderId, "REJECTED");
        return;
      }

      if (paymentStatus === "APPROVED" && orderStatus === "RECEBIDO") {
        repository.updateOrderStatus(orderId, "PREPARACAO");
        repository.updatePaymentStatus(orderId, "APPROVED");
        return;
      } else {
        repository.updatePaymentStatus(orderId, "APPROVED");
      }
    } catch (error) {
      throw error;
    }
  }
}
