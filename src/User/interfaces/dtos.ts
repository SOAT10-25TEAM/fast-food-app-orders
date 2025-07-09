import { z } from "zod";

export interface CreateUserRequestDTO {
  name: string;
  cpf: string;
  email: string;
}

export interface UserDTO {
  id?: number;
  name: string;
  cpf: string;
  email: string;
}

export const CreateUserValidator = {
  validate(input: any): CreateUserRequestDTO {
    const schema = z.object({
      name: z.string({
        required_error: "Nome é obrigatório",
        invalid_type_error: "Nome deve ser uma string",
      }),
      cpf: z
        .string({
          required_error: "CPF é obrigatório",
          invalid_type_error: "CPF deve ser uma string",
        })
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
          message: "CPF deve estar no formato 999.999.999-99",
        }),
      email: z
        .string({
          required_error: "Email é obrigatório",
          invalid_type_error: "Email deve ser uma string",
        })
        .email({
          message: "Email inválido",
        }),
    });

    return schema.parse(input);
  },
};
