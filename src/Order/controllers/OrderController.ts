import { CreateOrderRequestDTO, PaymentWebhookDTO } from "../interfaces/dtos";
import {
  MockPaymentRepository,
  OrderRepository,
} from "../interfaces/repositories";
import { OrderJsonPresenter } from "../presenters/orderPresenter";
import { OrderUseCase } from "../useCases/orderUseCase";
import { postProcessPayment} from "../../clients/payment-api-client";
import { ProcessPaymentResponseDTO } from "../interfaces/dtos";


export class OrderController {
  static async createOrder(
    orderData: CreateOrderRequestDTO,
    repository: OrderRepository,
    presenter: OrderJsonPresenter
  ) {
    const order = await OrderUseCase.createOrder(
      orderData,
      repository
    );

    return presenter.toResponse(order, "Pedido criado com sucesso", true);
  }

  static async listOrders(
    repository: OrderRepository,
    presenter: OrderJsonPresenter
  ) {
    const orders = await OrderUseCase.listOrders(repository);
    return presenter.toResponseList(orders, "Pedidos listados com sucesso");
  }

  static async getPaymentStatus(
    code: string,
    repository: OrderRepository,
    presenter: OrderJsonPresenter
  ) {
    try {
      const orderPaymentStatus = await OrderUseCase.getPaymentStatus(
        code,
        repository
      );

      return presenter.toResponse(
        { paymentStatus: orderPaymentStatus?.paymentStatus },
        "Status do pagamento obtido com sucesso"
      );
    } catch (error) {
      throw error;
    }
  }

  static async updateOrderStatus(
    updateData: { id: number; status: string },
    repository: OrderRepository,
    presenter: OrderJsonPresenter
  ) {
    try {
      await OrderUseCase.updateOrderStatus(
        { id: updateData.id, status: updateData.status },
        repository
      );

      return presenter.toResponse(
        null,
        "Status do pedido atualizado com sucesso"
      );
    } catch (error) {
      throw error;
    }
  }


  // 🚀 Novo método para executar a API de pagamento
  static async executePaymentAPI(
    {
      code,
      amount,
    }: { code: string; amount: number },
    presenter: OrderJsonPresenter
  ) {
    try {
      const paymentResponse: ProcessPaymentResponseDTO = await postProcessPayment(code, amount);

      return presenter.toResponse(
        paymentResponse,
        `Pagamento do pedido ${code} processado com sucesso`
      );
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
    orderRepository: OrderRepository,
    presenter: OrderJsonPresenter
  ) {
    try {
      await OrderUseCase.executePayment(
        { code: code, paymentStatus },
        paymentRepository,
        orderRepository
      );

      return presenter.toResponse(
        null,
        `Requisição de pagamento do pedido ${code} realizado com sucesso`
      );
    } catch (error) {
      throw error;
    }
  }

  static async handlePaymentWebhook(
    paymentData: PaymentWebhookDTO,
    orderRepository: OrderRepository,
    presenter: OrderJsonPresenter
  ) {
    try {
      await OrderUseCase.handlePaymentWebhook(orderRepository, paymentData);

      return presenter.toResponse(null, "Webhook processado com sucesso");
    } catch (error) {
      throw error;
    }
  }
}
