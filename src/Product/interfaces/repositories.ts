import { Category } from "../entities/category";
import { Product } from "../entities/product";
import { CreateProductRequestDTO, UpdateProductRequestDTO } from "./dtos";

export interface ProductRepository {
  create(product: CreateProductRequestDTO): Promise<Product | null>;
  update(product: UpdateProductRequestDTO): Promise<Product | null>;
  remove(productId: number): Promise<number | null | undefined>;
  findById(productId: number, categoryId?: number): Promise<Product | null>;
  listByCategory(categoryId: number): Promise<Product[] | null>;
  findByName(name: string, categoryId: number): Promise<Product | null>;
  findByCategoryId(categoryId: number): Promise<Category | null>;
}
