import { User } from "../entities/user";

export interface UserRepository {
  findByCPF(cpf: string): Promise<User | null>;
  create(user: {
    name: string;
    cpf: string;
    email: string;
  }): Promise<User | null>;
}
