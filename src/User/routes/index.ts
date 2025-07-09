import cors from "cors";
import { Router } from "express";
import { z } from "zod";
import { DBConnection } from "../../interfaces/DBConnection";
import { UserController } from "../controllers/userController";
import { UserGateway } from "../gateways/userGateway";
import { CreateUserValidator } from "../interfaces/dtos";
import { UserJsonPresenter } from "../presenters/userPresenter";
import { JWTToken } from "../../api/middlewares/jwtMiddleware";

export const userRoutes = (dbConnection: DBConnection<any>): Router => {
  const router = Router();
  router.use(cors({ origin: "*" }));

  const userRepository = new UserGateway(dbConnection);
  const userPresenter = new UserJsonPresenter();

  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: Gerenciamento de usuários
   */

  /**
   * @swagger
   * /user/create:
   *   post:
   *     summary: Cria um novo usuário
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Nome do usuário
   *                 example: João Silva
   *               cpf:
   *                 type: string
   *                 description: CPF do usuário
   *                 example: "999.999.999-99"
   *               email:
   *                 type: string
   *                 description: Email do usuário
   *                 example: joao.silva@example.com
   *     responses:
   *       200:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuário criado com sucesso
   *                 response:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                       example: 1
   *                     name:
   *                       type: string
   *                       example: João Silva
   *                     cpf:
   *                       type: string
   *                       example: 999.999.999-99
   *                     email:
   *                       type: string
   *                       example: joao.silva@example.com
   *       400:
   *         description: Erro de validação
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: Erro de validação
   *                     details:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           path:
   *                             type: string
   *                             example: name
   *                           message:
   *                             type: string
   *                             example: O nome é obrigatório
   *       500:
   *         description: Erro interno no servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: Erro interno do servidor
   *                     details:
   *                       type: string
   *                       example: Detalhes do erro (apenas em desenvolvimento)
   */
  router.post("/user/create", async (req, res, next) => {
    try {
      const userData = CreateUserValidator.validate(req.body);
      const response = await UserController.createUser(
        userData,
        userRepository,
        userPresenter
      );

      res.status(response.statusCode).json({ ...response.body });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /user/{cpf}:
   *   get:
   *     summary: Busca um usuário pelo CPF
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: cpf
   *         required: true
   *         description: CPF do usuário a ser buscado
   *         schema:
   *           type: string
   *           example: "999.999.999-99"
   *     responses:
   *       200:
   *         description: Usuário encontrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuário encontrado com sucesso
   *                 response:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                       example: 1
   *                     name:
   *                       type: string
   *                       example: João Silva
   *                     cpf:
   *                       type: string
   *                       example: 999.999.999-99
   *                     email:
   *                       type: string
   *                       example: joao.silva@example.com
   *       400:
   *         description: CPF inválido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: CPF precisa ser informado!
   *       404:
   *         description: Usuário não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: Usuário não encontrado!
   *       500:
   *         description: Erro interno no servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: Erro interno do servidor
   *                     details:
   *                       type: string
   *                       example: Detalhes do erro (apenas em desenvolvimento)
   */
  router.get("/user", JWTToken, async (req, res, next) => {
    try {
      const { cpf } = req.query.params as any;

      if (typeof cpf !== "string") {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            message: "CPF precisa ser informado!",
            path: ["cpf"],
          },
        ]);
      }

      const response = await UserController.findUserByCPF(
        cpf,
        userRepository,
        userPresenter
      );

      console.log(response.body.response, "------", response.body);

      res.status(response.statusCode).json({ user: response.body.response });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
