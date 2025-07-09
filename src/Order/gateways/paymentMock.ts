import axios from "axios";
import { BusinessError } from "../../utils/errors";
import { MockPaymentRepository } from "../interfaces/repositories";

export class PaymentGateway implements MockPaymentRepository {
  private webhookUrl: string;

  constructor(webhookURL: string) {
    this.webhookUrl = webhookURL;
  }

  async processPayment(
    orderId: number,
    paymentStatus: "APPROVED" | "REJECTED",
    orderStatus: string
  ) {
    try {
      await axios.post(this.webhookUrl, {
        orderId,
        paymentStatus,
        orderStatus,
      });

      return {
        success: true,
        message: "Requisição de pagamento realizada com sucesso",
      };
    } catch (error: any) {
      console.log(error, "Erro Axios");

      return {
        success: false,
        message: "Erro ao requisitar pagamento",
      };
    }
  }
}
