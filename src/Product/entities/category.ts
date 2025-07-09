export class Category {
  constructor(
    private readonly _id: number,
    private _name: string,
    private _description?: string
  ) {}

  static create(
    id: number,
    name: string,
    description?: string
  ): Category | null {
    if (!id || !name) {
      return null;
    }
    return new Category(id, name, description);
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }
}
