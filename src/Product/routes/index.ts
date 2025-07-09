import cors from "cors";
import { Router } from "express";
import { DBConnection } from "../../interfaces/DBConnection";
import { ProductController } from "../controllers/productController";
import { ProductGateway } from "../gateways/productGateway";
import { CreateProductValidator } from "../interfaces/dtos";
import { ProductJsonPresenter } from "../presenters/productPresenter";
import { z } from "zod";

export const productRoutes = (dbConnection: DBConnection<any>): Router => {
  const router = Router();
  router.use(cors({ origin: "*" }));

  const productRepository = new ProductGateway(dbConnection);
  const productPresenter = new ProductJsonPresenter();

  /**
   * @swagger
   * tags:
   *   name: Products
   *   description: Gerenciamento de produtos
   */

  /**
   * @swagger
   * /product/create:
   *   post:
   *     summary: Cria um novo produto
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Nome do produto
   *                 example: Big Mac
   *               price:
   *                 type: number
   *                 description: Preço do produto
   *                 example: 59.99
   *               description:
   *                 type: string
   *                 description: Descrição do produto
   *                 example: 1 x pão; 2 x hamburgueres; 1 x queijo
   *               image:
   *                 type: string
   *                 description: URL da imagem do produto
   *                 example: https://example.com/imagem.jpg
   *               categoryId:
   *                 type: number
   *                 description: ID da categoria do produto
   *                 example: 1
   *     responses:
   *       200:
   *         description: Produto criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Produto criado com sucesso"
   *                 response:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                       example: "Big Mac"
   *                     price:
   *                       type: number
   *                       example: 59.99
   *                     description:
   *                       type: string
   *                       example: "1 x pão; 2 x hamburgueres; 1 x queijo"
   *                     image:
   *                       type: string
   *                       example: "https://example.com/imagem.jpg"
   *                     categoryId:
   *                       type: number
   *                       example: 1
   *       404:
   *         description: Categoria não encontrada
   *       400:
   *         description: Erro de validação
   *       500:
   *         description: Erro interno do servidor
   */
  router.post("/product/create", async (req, res, next) => {
    try {
      const productData = CreateProductValidator.validate(req.body);
      const response = await ProductController.createProduct(
        productData,
        productRepository,
        productPresenter
      );

      res.status(response.statusCode).json({ ...response.body });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /product:
   *   put:
   *     summary: Atualiza um produto existente
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: number
   *                 description: ID do produto
   *                 example: 1
   *               name:
   *                 type: string
   *                 description: Nome do produto
   *                 example: Big Mac
   *               price:
   *                 type: number
   *                 description: Preço do produto
   *                 example: 59.99
   *               description:
   *                 type: string
   *                 description: Descrição do produto
   *                 example: 1 x pão; 2 x hamburgueres; 1 x queijo
   *               image:
   *                 type: string
   *                 description: URL da imagem do produto
   *                 example: https://example.com/imagem.jpg
   *               categoryId:
   *                 type: number
   *                 description: ID da categoria do produto
   *                 example: 1
   *     responses:
   *       200:
   *         description: Produto atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Produto atualizado com sucesso"
   *                 response:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                       example: "Big Mac"
   *                     price:
   *                       type: number
   *                       example: 59.99
   *                     description:
   *                       type: string
   *                       example: "1 x pão; 2 x hamburgueres; 1 x queijo"
   *                     image:
   *                       type: string
   *                       example: "https://example.com/imagem.jpg"
   *                     categoryId:
   *                       type: number
   *                       example: 1
   *       404:
   *         description: Produto não encontrado
   *       400:
   *         description: Erro de validação
   *       500:
   *         description: Erro interno do servidor
   */
  router.put("/product", async (req, res, next) => {
    try {
      const productData = req.body;

      if (!productData.id) {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            message: "Id do item Obrigatório!",
            path: ["id"],
          },
        ]);
      }

      const response = await ProductController.updateProduct(
        productData,
        productRepository,
        productPresenter
      );

      res.status(response.statusCode).json({ ...response.body });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /product/{id}:
   *   delete:
   *     summary: Remove um produto pelo ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do produto a ser removido
   *         schema:
   *           type: number
   *           example: 1
   *     responses:
   *       200:
   *         description: Produto removido com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 response:
   *                   type: object
   *                   properties:
   *                     productId:
   *                       type: number
   *                       example: 1
   *       400:
   *         description: Erro de validação
   *       500:
   *         description: Erro interno do servidor
   */
  router.delete("/product/:id", async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);

      if (!productId) {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            message: "Id do item Obrigatório!",
            path: ["id"],
          },
        ]);
      }

      const result = await ProductController.removeProduct(
        productId,
        productRepository,
        productPresenter
      );

      res.status(result.statusCode).json({ ...result.body });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /product/list-by-category/{categoryId}:
   *   get:
   *     summary: Lista produtos por categoria
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         description: ID da categoria
   *         schema:
   *           type: number
   *           example: 1
   *     responses:
   *       200:
   *         description: Lista de produtos na categoria
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: number
   *                     example: 1
   *                   name:
   *                     type: string
   *                     example: Big Mac
   *                   price:
   *                     type: number
   *                     example: 59.99
   *                   description:
   *                     type: string
   *                     example: 1 x pão; 2 x hamburgueres; 1 x queijo
   *                   image:
   *                     type: string
   *                     example: https://example.com/imagem.jpg
   *                   categoryId:
   *                     type: number
   *                     example: 1
   *       400:
   *         description: Erro de validação
   *       500:
   *         description: Erro interno do servidor
   */
  router.get(
    "/product/list-by-category/:categoryId",
    async (req, res, next) => {
      try {
        const categoryId = parseInt(req.params.categoryId);
        const response = await ProductController.listProductsByCategory(
          categoryId,
          productRepository,
          productPresenter
        );

        res.status(response.statusCode).json({ ...response.body });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};
