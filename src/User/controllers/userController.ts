import { APIResponse } from "../../interfaces/Adapter";
import { CreateUserRequestDTO } from "../interfaces/dtos";
import { UserResponseDTO } from "../interfaces/presenters";
import { UserRepository } from "../interfaces/repositories";
import { UserJsonPresenter } from "../presenters/userPresenter";
import { UserUseCase } from "../useCases/userUseCase";
import jwt from "jsonwebtoken";

import "dotenv/config";

const SECRET = process.env.JWT_SECRET ?? "";
export class UserController {
  static async findUserByCPF(
    cpf: string,
    repository: UserRepository,
    presenter: UserJsonPresenter
  ): Promise<APIResponse<UserResponseDTO | string>> {
    const user = await UserUseCase.findUserByCPF(cpf, repository);

    const jwtUser = jwt.sign({ ...user }, SECRET, { expiresIn: "120m" });

    return presenter.toResponse(jwtUser, "Usuário encontrado com sucesso");
  }

  static async createUser(
    userDTO: CreateUserRequestDTO,
    repository: UserRepository,
    presenter: UserJsonPresenter
  ): Promise<APIResponse<UserResponseDTO | string>> {
    const user = await UserUseCase.createUser(userDTO, repository);
    return presenter.toResponse(user, "Usuário criado com sucesso", true);
  }
}
