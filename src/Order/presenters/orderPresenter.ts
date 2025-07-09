import { APIResponse, ListableDataPresenter } from "../../interfaces/Adapter";
import { Order } from "../entities/order";
import { OrderResponseDTO } from "../interfaces/dtos";

export class OrderJsonPresenter
  implements ListableDataPresenter<Order, OrderResponseDTO>
{
  toJSON(order: Order & { totalPrice: number }): OrderResponseDTO {
    return {
      id: order.id,
      orderDate: order.orderDate,
      status: order.status,
      items: order.items,
      totalPrice: order.totalPrice,
      code: order.code,
      paymentStatus: order.paymentStatus,
    };
  }

  toResponse(
    data: (Order & { totalPrice: number }) | null | any,
    message?: string,
    isCreated?: boolean
  ): APIResponse<OrderResponseDTO> {
    return {
      statusCode: isCreated ? 201 : 200,
      body: {
        message: message || "Operação realizada com sucesso",
        response: data ? this.toJSON(data) : undefined,
      },
    };
  }

  toResponseList(
    data: (Order & { totalPrice: number })[] | null,
    message?: string
  ): APIResponse<OrderResponseDTO[]> {
    return {
      statusCode: 200,
      body: {
        message: message || "Operação realizada com sucesso",
        response: data ? data.map((order) => this.toJSON(order)) : undefined,
      },
    };
  }
}
