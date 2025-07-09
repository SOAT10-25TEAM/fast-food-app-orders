export class User {
  private _id: number | string;
  private _name: string;
  private _cpf: string;
  private _email: string;

  private constructor(id: number, name: string, cpf: string, email: string) {
    this._id = id;
    this._name = name;
    this._cpf = cpf;
    this._email = email;
  }

  static create(
    id?: number,
    name?: string,
    cpf?: string,
    email?: string
  ): User | null {
    if (!id || !name || !cpf || !email) {
      return null;
    }
    return new User(id, name, cpf, email);
  }

  get id(): number | string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get cpf(): string {
    return this._cpf;
  }
  get email(): string {
    return this._email;
  }
}
