import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCategoriesTable1670000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "categories",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
          },
        ],
      }),
      true
    );

    await queryRunner.query(
      `INSERT INTO categories (name) VALUES 
      ('Lanche'), 
      ('Acompanhamento'), 
      ('Bebida'), 
      ('Sobremesa')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("categories");
  }
}
