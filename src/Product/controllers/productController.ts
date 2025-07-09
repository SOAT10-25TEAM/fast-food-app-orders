import { APIResponse, DeletedProductResponse } from "../../interfaces/Adapter";
import {
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
} from "../interfaces/dtos";
import { ProductResponseDTO } from "../interfaces/presenters";
import { ProductRepository } from "../interfaces/repositories";
import { ProductJsonPresenter } from "../presenters/productPresenter";
import { ProductUseCase } from "../useCases/productUseCase";

export class ProductController {
  static async createProduct(
    productData: CreateProductRequestDTO,
    repository: ProductRepository,
    presenter: ProductJsonPresenter
  ): Promise<APIResponse<ProductResponseDTO>> {
    const product = await ProductUseCase.createProduct(productData, repository);
    return presenter.toResponse(product, "Produto criado com sucesso", true);
  }

  static async updateProduct(
    productData: UpdateProductRequestDTO,
    repository: ProductRepository,
    presenter: ProductJsonPresenter
  ): Promise<APIResponse<ProductResponseDTO>> {
    const produto = await ProductUseCase.updateProduct(productData, repository);
    return presenter.toResponse(produto);
  }

  static async removeProduct(
    productId: number,
    repository: ProductRepository,
    presenter: ProductJsonPresenter
  ): Promise<APIResponse<DeletedProductResponse>> {
    const deleted = await ProductUseCase.removeProduct(productId, repository);
    return presenter.toResponseDeleted(deleted, "Produto deletado com sucesso");
  }

  static async listProductsByCategory(
    categoryId: number,
    repository: ProductRepository,
    presenter: ProductJsonPresenter
  ): Promise<APIResponse<ProductResponseDTO[]>> {
    const product = await ProductUseCase.listProductsByCategory(
      categoryId,
      repository
    );

    return presenter.toResponseList(product);
  }
}
