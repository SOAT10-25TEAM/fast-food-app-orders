import { APIResponse, BaseDataPresenter } from "../../interfaces/Adapter";
import { User } from "../entities/user";
import { UserResponseDTO } from "../interfaces/presenters";

export class UserJsonPresenter
  implements BaseDataPresenter<User, UserResponseDTO | string>
{
  toJSON(user: User): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
    };
  }

  toResponse(
    data: User | string | null,
    message?: string,
    isCreated?: boolean
  ): APIResponse<UserResponseDTO | string> {
    return {
      statusCode: isCreated ? 201 : 200,
      body: {
        message: message || "Operação realizada com sucesso",
        response: data
          ? typeof data === "string"
            ? data
            : this.toJSON(data)
          : undefined,
      },
    };
  }
}
