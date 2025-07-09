import { DBConnection } from "../../interfaces/DBConnection";
import { User } from "../entities/user";
import { UserRepository } from "../interfaces/repositories";

export class UserGateway implements UserRepository {
  private dbConnection: DBConnection<User>;
  private tableName = "users";

  constructor(dbConnection: DBConnection<any>) {
    this.dbConnection = dbConnection;
  }

  async findByCPF(cpf: string): Promise<User | null> {
    try {
      const userData = await this.dbConnection.findOne(this.tableName, { cpf });

      return User.create(
        userData?.id,
        userData?.name,
        userData?.cpf,
        userData?.email
      );
    } catch (error) {
      throw error;
    }
  }

  async create(userData: { name: string; cpf: string; email: string }) {
    try {
      const newUserData = await this.dbConnection.save(
        this.tableName,
        userData
      );

      return User.create(
        newUserData?.id,
        newUserData?.name,
        newUserData?.cpf,
        newUserData?.email
      );
    } catch (error) {
      throw error;
    }
  }
}
