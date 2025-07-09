export interface DBConnection<P> {
  findAll(tableName: string): Promise<any[]>;
  findOne(
    tableName: string,
    criteria?: { [K in keyof P]?: P[K] },
    relations?: string[]
  ): Promise<any | null>;
  findBy(
    tableName: string,
    criteria: Record<string, any>,
    relations?: string[]
  ): Promise<any[]>;
  save(tableName: string, entity: any): Promise<any>;
  update(tableName: string, criteria: any, partialEntity: any): Promise<any>;
  delete(tableName: string, criteria: any): Promise<any>;
  findWithOrder(
    tableName: string,
    options: {
      criteria?: Record<string, any>;
      orderBy: {
        field: string;
        direction: "ASC" | "DESC";
        customOrder?: Record<string, number>;
      }[];
      relations?: string[];
      pagination?: { page: number; pageSize?: number };
    }
  ): Promise<any[]>;
}
