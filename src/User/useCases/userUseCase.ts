import { BusinessError } from "../../utils/errors";
import { User } from "../entities/user";
import { UserDTO } from "../interfaces/dtos";
import { UserRepository } from "../interfaces/repositories";

export class UserUseCase {
  static async findUserByCPF(cpf: string, repository: UserRepository) {
    try {
      const user = await repository.findByCPF(cpf);

      if (!user) {
        throw new BusinessError("Usuário não encontrado!", 404);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async createUser(userDTO: UserDTO, repository: UserRepository) {
    try {
      const { cpf, email, name } = userDTO;
      const exists = await repository.findByCPF(cpf);

      if (exists) {
        throw new BusinessError("Usuário já existe!", 400);
      }

      return await repository.create({ cpf, email, name });
    } catch (error) {
      throw error;
    }
  }
}
