import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { AppDataSource } from "./config";
import { DBConnection } from "../../interfaces/DBConnection";
import { DatabaseError } from "../../utils/errors";

export class TypeORMConnection implements DBConnection<any> {
  private getRepo(tableName: string): Repository<any> {
    return AppDataSource.getRepository(tableName);
  }

  async findAll(tableName: string) {
    try {
      const repo = this.getRepo(tableName);
      return repo.find();
    } catch (error) {
      throw new DatabaseError("Failed to fetch data from the database", error);
    }
  }

  findOne(
    tableName: string,
    criteria: { [x: string]: any },
    relations?: string[]
  ) {
    try {
      const repo = this.getRepo(tableName);

      return repo.findOne({ where: criteria, relations });
    } catch (error) {
      throw new DatabaseError("Failed to fetch data from the database", error);
    }
  }

  async findBy(
    tableName: string,
    criteria: Record<string, any>,
    relations: string[]
  ) {
    try {
      const repo = this.getRepo(tableName);
      const query = repo.createQueryBuilder(tableName);

      Object.keys(criteria).forEach((field) => {
        query.andWhere(`${field} = :${field}`, { [field]: criteria[field] });
      });

      if (relations) {
        relations.forEach((relation) => {
          query.leftJoinAndSelect(`${tableName}.${relation}`, relation);
        });
      }

      return query.getMany();
    } catch (error) {
      throw new DatabaseError("Failed to fetch data from the database", error);
    }
  }

  async save(tableName: string, entity: any) {
    try {
      const repo = this.getRepo(tableName);
      return repo.save(entity);
    } catch (error) {
      throw new DatabaseError("Failed to fetch data from the database", error);
    }
  }

  async update(tableName: string, criteria: any, partialEntity: any) {
    try {
      const repo = this.getRepo(tableName);
      return await repo.update(criteria, partialEntity);
    } catch (error) {
      throw new DatabaseError("Failed to fetch data from the database", error);
    }
  }

  async delete(tableName: string, criteria: any) {
    try {
      const repo = this.getRepo(tableName);
      return await repo.delete(criteria);
    } catch (error) {
      throw new DatabaseError("Failed to fetch data from the database", error);
    }
  }

  async findWithOrder(
    tableName: string,
    options: {
      criteria?: Record<string, any>;
      orderBy: Array<{
        field: string;
        direction: "ASC" | "DESC";
        customOrder?: Record<string, number>;
      }>;
      pagination?: {
        page: number;
        pageSize?: number;
      };
      relations?: string[];
    }
  ) {
    try {
      const repo = this.getRepo(tableName);
      const query = repo.createQueryBuilder(tableName);
      const { criteria, orderBy, pagination } = options;
      const defaultPageSize = 10;

      if (criteria) {
        Object.keys(criteria).forEach((field) => {
          query.andWhere(`${tableName}.${field} = :${field}`, {
            [field]: criteria[field],
          });
        });
      }

      if (options.relations) {
        options.relations.forEach((relation) => {
          query.leftJoinAndSelect(`${tableName}.${relation}`, relation);
        });
      }

      orderBy.forEach((order, index) => {
        if (order.customOrder) {
          const cases = Object.entries(order.customOrder)
            .map(
              ([value, orderValue]) =>
                `WHEN ${order.field} = '${value}' THEN ${orderValue}`
            )
            .join(" ");

          const orderExpression = `(CASE ${cases} ELSE 999999 END)`;

          if (index === 0) {
            query.orderBy(orderExpression, order.direction);
          } else {
            query.addOrderBy(orderExpression, order.direction);
          }
        } else {
          if (index === 0) {
            query.orderBy(order.field, order.direction);
          } else {
            query.addOrderBy(order.field, order.direction);
          }
        }
      });

      if (pagination && pagination.page > 0) {
        const pageSize = pagination.pageSize || defaultPageSize;
        query.skip((pagination.page - 1) * pageSize).take(pageSize);
      }

      return query.getMany();
    } catch (error) {
      throw new DatabaseError("Failed to fetch data from the database", error);
    }
  }
}
