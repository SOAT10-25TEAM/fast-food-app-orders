import {
  APIResponse,
  DeletedProductResponse,
  ListableDataPresenter,
} from "../../interfaces/Adapter";
import { Product } from "../entities/product";
import { ProductResponseDTO } from "../interfaces/presenters";

export class ProductJsonPresenter
  implements ListableDataPresenter<Product, ProductResponseDTO>
{
  toJSON(product: Product): ProductResponseDTO {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      categoryId: product.categoryId,
    };
  }

  toResponse(
    data: Product | null,
    message?: string,
    isCreated?: boolean
  ): APIResponse<ProductResponseDTO> {
    return {
      statusCode: isCreated ? 201 : 200,
      body: {
        message: message || "Operação realizada com sucesso",
        response: data ? this.toJSON(data) : undefined,
      },
    };
  }

  toResponseList(
    data: Product[] | null,
    message?: string
  ): APIResponse<ProductResponseDTO[]> {
    return {
      statusCode: 200,
      body: {
        message: message || "Operação realizada com sucesso",
        response: data
          ? data.map((product) => this.toJSON(product))
          : undefined,
      },
    };
  }

  toResponseDeleted(
    data: number | string,
    message?: string
  ): APIResponse<DeletedProductResponse> {
    return {
      statusCode: 200,
      body: {
        message: message || "Operação realizada com sucesso",
        response: { id: data },
      },
    };
  }
}
