import { z } from "zod";

export interface CreateProductRequestDTO {
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
}

export interface UpdateProductRequestDTO
  extends Partial<CreateProductRequestDTO> {
  id: number;
}

export const CreateProductValidator = {
  validate(input: any): CreateProductRequestDTO {
    const schema = z.object({
      name: z.string().nonempty("Nome do produto obrigatório"),
      price: z.number().nonnegative("Valor não deve ser negativo"),
      description: z.string().nonempty("Descrição do produto obrigatório"),
      image: z.string().nonempty("URL da imagem obrigatória"),
      categoryId: z.number(),
    });

    return schema.parse(input);
  },
};
