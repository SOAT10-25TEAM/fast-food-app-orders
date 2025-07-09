import { BusinessError } from "../../utils/errors";
import { Product } from "../entities/product";
import {
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
} from "../interfaces/dtos";
import { ProductRepository } from "../interfaces/repositories";

export class ProductUseCase {
  static async createProduct(
    productData: CreateProductRequestDTO,
    repository: ProductRepository
  ): Promise<Product> {
    try {
      const existingCategory = await repository.findByCategoryId(
        productData.categoryId
      );

      if (!existingCategory) {
        throw new BusinessError("Categoria não encontrada!", 404);
      }

      const existingProduct = await repository.findByName(
        productData.name,
        productData.categoryId
      );

      if (existingProduct) {
        throw new BusinessError(
          `Produto já esta cadastrado: ID: ${existingProduct.id}!`,
          400
        );
      }

      const product = await repository.create(productData);

      if (!product) {
        throw new BusinessError("Erro ao criar produto!", 500);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(
    productData: UpdateProductRequestDTO,
    repository: ProductRepository
  ): Promise<Product> {
    try {
      const existingProduct = await repository.findById(
        productData.id,
        productData.categoryId ?? 1
      );

      if (!existingProduct) {
        throw new BusinessError("Produto não encontrado!", 404);
      }

      const product = await repository.update(productData);

      if (!product) {
        throw new BusinessError("Erro ao atualizar produto!", 500);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async removeProduct(
    productId: number,
    repository: ProductRepository
  ): Promise<number> {
    try {
      const deleted = await repository.remove(productId);

      if (!deleted) {
        throw new BusinessError("Erro ao deletar produto!", 500);
      }

      return productId;
    } catch (error) {
      throw error;
    }
  }

  static async findProductById(
    productId: number,
    repository: ProductRepository
  ): Promise<Product> {
    try {
      const product = await repository.findById(productId);

      if (!product) {
        throw new BusinessError("Produto não encontrado!", 404);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async listProductsByCategory(
    categoryId: number,
    repository: ProductRepository
  ): Promise<Product[]> {
    try {
      const category = await repository.findByCategoryId(categoryId);
      if (!category) {
        throw new BusinessError("Categoria não encontrada!", 404);
      }

      const products = await repository.listByCategory(categoryId);

      if (!products || products.length === 0) {
        throw new BusinessError(
          "Nenhum produto encontrado para esta categoria!",
          404
        );
      }

      return products;
    } catch (error) {
      throw error;
    }
  }
}
