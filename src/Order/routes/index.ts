import { Router } from "express";
import cors from "cors";
import { OrderController } from "../controllers/OrderController";
import {
  CreateOrdertValidator,
  PaymentWebhookValidator,
} from "../interfaces/dtos";
import { OrderJsonPresenter } from "../presenters/orderPresenter";
import { OrderGateway } from "../gateways/orderGateway";
import { ProductGateway } from "../../Product/gateways/productGateway";
import { generateCode } from "../../utils/functions";
import { z } from "zod";
import { PaymentGateway } from "../gateways/paymentMock";

export const orderRoutes = (dbConnection: any): Router => {
  const orderRoutes = Router();

  orderRoutes.use(cors({ origin: "*" }));

  const orderRepository = new OrderGateway(dbConnection);
  const orderPresenter = new OrderJsonPresenter();
  const productRepository = new ProductGateway(dbConnection);
  const paymentRepository = new PaymentGateway(
    process.env.WEBHOOK_URL ||
      "http://localhost:3002/soat-api/order/payment-webhook"
  );

  /**
   * @swagger
   * tags:
   *   name: Orders
   *   description: Gerenciamento de pedidos
   */

  /**
   * @swagger
   * /order/create:
   *   post:
   *     summary: Cria um novo pedido
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               orderDate:
   *                 type: string
   *                 format: date-time
   *                 example: "2025-01-20T10:00:00.000Z"
   *               status:
   *                 type: string
   *                 enum: [RECEBIDO, PREPARACAO, PRONTO, FINALIZADO]
   *                 example: "RECEBIDO"
   *               items:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     productId:
   *                       type: number
   *                       example: 1
   *                     quantity:
   *                       type: number
   *                       example: 2
   *     responses:
   *       201:
   *         description: Pedido criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Pedido criado com sucesso"
   *                 response:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                       example: 2
   *                     orderDate:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-01-20T10:00:00.000Z"
   *                     status:
   *                       type: string
   *                       enum: [RECEBIDO, PREPARACAO, PRONTO, FINALIZADO]
   *                       example: "RECEBIDO"
   *                     items:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           productId:
   *                             type: number
   *                             example: 1
   *                           quantity:
   *                             type: number
   *                             example: 2
   *                     totalPrice:
   *                       type: number
   *                       format: decimal
   *                       example: 111.60
   *       400:
   *         description: Erro de validação na requisição
   *       404:
   *         description: Produto não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  orderRoutes.post("/order/create", async (req, res, next) => {
    try {
      const orderData = CreateOrdertValidator.validate(req.body);

      const response = await OrderController.createOrder(
        { ...orderData, code: generateCode() },
        orderRepository,
        productRepository,
        orderPresenter
      );

      res.status(response.statusCode).json({ ...response.body });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /order/update-status/{id}:
   *   put:
   *     summary: Atualiza o status de um pedido
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do pedido a ser atualizado
   *         schema:
   *           type: integer
   *           example: 1
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [RECEBIDO, PREPARACAO, PRONTO, FINALIZADO]
   *                 example: "PREPARACAO"
   *     responses:
   *       200:
   *         description: Status do pedido atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Status do pedido atualizado com sucesso"
   *       400:
   *         description: Erro de validação
   *       404:
   *         description: Pedido não encontrado
   *       500:
   *         description: Erro interno do servidor
   */

  orderRoutes.put("/order/update-status/:id", async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id, 10);
      const status = req.body.status;
      const validStatus = ["RECEBIDO", "PREPARACAO", "PRONTO", "FINALIZADO"];
      if (!orderId) {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            message: "Id do item Obrigatório!",
            path: ["id"],
          },
        ]);
      }

      if (!validStatus.includes(status)) {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            message: "Status inválido!",
            path: ["status"],
          },
        ]);
      }
      const response = await OrderController.updateOrderStatus(
        { id: orderId, status },
        orderRepository,
        orderPresenter
      );

      res.status(response.statusCode).json({ ...response.body });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /order:
   *   get:
   *     summary: Lista todos os pedidos
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: Lista de pedidos encontrada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Pedidos listados com sucesso"
   *                 response:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: number
   *                         example: 1
   *                       orderDate:
   *                         type: string
   *                         format: date-time
   *                         example: "2025-01-20T10:00:00.000Z"
   *                       status:
   *                         type: string
   *                         enum: [RECEBIDO, PREPARACAO, PRONTO, FINALIZADO]
   *                         example: "RECEBIDO"
   *                       items:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             productId:
   *                               type: number
   *                               example: 1
   *                             quantity:
   *                               type: number
   *                               example: 2
   *                       totalPrice:
   *                         type: number
   *                         format: decimal
   *                         example: 111.60
   *       404:
   *         description: Nenhum pedido encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  orderRoutes.get("/order", async (req, res, next) => {
    try {
      const response = await OrderController.listOrders(
        orderRepository,
        orderPresenter
      );

      res.status(response.statusCode).json({ ...response.body });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /order/payment-status/{code}:
   *   get:
   *     summary: Verifica o status de pagamento de um pedido
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: code
   *         required: true
   *         description: Código único do pedido
   *         schema:
   *           type: string
   *           example: "ORD12345"
   *     responses:
   *       200:
   *         description: Status do pagamento obtido com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Status do pagamento obtido com sucesso"
   *                 response:
   *                   type: object
   *                   properties:
   *                     paymentStatus:
   *                       type: string
   *                       enum: [PENDING, APPROVED, REJECTED]
   *                       example: "APPROVED"
   *       400:
   *         description: Código do pedido inválido
   *       404:
   *         description: Pedido não encontrado
   *       500:
   *         description: Erro interno do servidor
   */

  orderRoutes.get("/order/payment-status/:code", async (req, res, next) => {
    try {
      const orderCode = req.params.code;

      if (!orderCode) {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            message: "Código do item Obrigatório!",
            path: ["code"],
          },
        ]);
      }

      const response = await OrderController.getPaymentStatus(
        orderCode,
        orderRepository,
        orderPresenter
      );

      res.status(response.statusCode).json({ ...response.body });
    } catch (error) {
      next(error);
    }
  });

  // Rota MOCK para Simular chamada webhook de pagamento

  /**
   * @swagger
   * /order/mock-payment-status/{code}:
   *   post:
   *     summary: Simula uma resposta de pagamento (apenas para testes)
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: code
   *         required: true
   *         description: Código único do pedido
   *         schema:
   *           type: string
   *           example: "ORD12345"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [APPROVED, REJECTED]
   *                 example: "APPROVED"
   *     responses:
   *       200:
   *         description: Requisição de pagamento processada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Requisição de pagamento do pedido ORD12345 realizado com sucesso"
   *       400:
   *         description: Erro de validação
   *       404:
   *         description: Pedido não encontrado
   *       500:
   *         description: Erro interno do servidor
   */

  orderRoutes.post(
    "/order/mock-payment-status/:code",
    async (req, res, next) => {
      try {
        const orderCode = req.params.code;
        const paymentStatus = req.body.status;

        const validPaymentStatus = ["APPROVED", "REJECTED"];

        if (!orderCode) {
          throw new z.ZodError([
            {
              code: z.ZodIssueCode.custom,
              message: "Código do item Obrigatório!",
              path: ["code"],
            },
          ]);
        }

        if (!validPaymentStatus.includes(paymentStatus)) {
          throw new z.ZodError([
            {
              code: z.ZodIssueCode.custom,
              message: "Status inválido!",
              path: ["status"],
            },
          ]);
        }
        const response = await OrderController.executePayment(
          { code: orderCode, paymentStatus },
          paymentRepository,
          orderRepository,
          orderPresenter
        );
        res.status(response?.statusCode || 200).json({ ...response?.body });
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @swagger
   * /order/payment-webhook:
   *   post:
   *     summary: Webhook para receber confirmação de pagamento
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               orderId:
   *                 type: number
   *                 example: 1
   *               status:
   *                 type: string
   *                 enum: [APPROVED, REJECTED]
   *                 example: "APPROVED"
   *               amount:
   *                 type: number
   *                 format: float
   *                 example: 99.90
   *               transactionId:
   *                 type: string
   *                 example: "tx_123456789"
   *     responses:
   *       200:
   *         description: Webhook processado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Webhook processado com sucesso"
   *                 status:
   *                   type: string
   *                   example: "OK"
   *       400:
   *         description: Erro de validação na requisição
   *       404:
   *         description: Pedido não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  orderRoutes.post("/order/payment-webhook", async (req, res, next) => {
    try {
      const paymentData = PaymentWebhookValidator.validate(req.body);
      const response = await OrderController.handlePaymentWebhook(
        paymentData,
        orderRepository,
        orderPresenter
      );

      res.status(response?.statusCode ?? 200).json({
        ...response?.body,
      });
    } catch (error) {
      next(error);
    }
  });

  return orderRoutes;
};
