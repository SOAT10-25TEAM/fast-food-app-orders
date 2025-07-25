import { z } from "zod";

export interface CreateOrderRequestDTO {
  userId: number;
  orderDate: string;
  status: string;
  code: string;
  items: {
    productId: number;
    quantity: number;
    price?: number;
  }[];
}

export interface OrderResponseDTO {
  id: number;
  userId: number;
  orderDate: Date;
  status: string;
  items: { productId: number; quantity: number }[];
  totalPrice: number;
  code: string;
  paymentStatus: string;
}

export interface PaymentWebhookDTO {
  orderId: number;
  paymentStatus: "APPROVED" | "REJECTED";
  orderStatus: "RECEBIDO" | "PREPARACAO" | "PRONTO" | "FINALIZADO";
}

export interface ProcessPaymentResponseDTO {
  paymentId: string;
  orderId: string;
  status: "APPROVED" | "REJECTED";
  amount: number;
  createdAt: string;
  processedAt: string;
}

export const CreateOrdertValidator = {
  validate(
    input: any
  ): Pick<CreateOrderRequestDTO, "userId" | "orderDate" | "status" | "items"> {
    const schema = z.object({
      userId: z.number(),
      orderDate: z.string().nonempty("Nome do produto obrigatório"),
      status: z.enum(["RECEBIDO", "PREPARACAO", "PRONTO", "FINALIZADO"]),
      items: z
        .array(
          z.object({
            productId: z.number(),
            quantity: z.number(),
            price: z.number().optional(),
          })
        )
        .nonempty("Necessário incluir itens"),
    });

    return schema.parse({ ...input, status: "RECEBIDO" });
  },
};

export const PaymentWebhookValidator = {
  validate(input: any): PaymentWebhookDTO {
    const schema = z.object({
      orderId: z.number(),
      paymentStatus: z.enum(["APPROVED", "REJECTED"]),
      orderStatus: z.enum(["RECEBIDO", "PREPARACAO", "PRONTO", "FINALIZADO"]),
    });

    return schema.parse(input);
  },
};
