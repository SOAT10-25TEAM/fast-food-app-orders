import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateOrderItemsTable1670000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "order_items",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "quantity",
            type: "int",
          },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "order_id",
            type: "int",
          },
          {
            name: "product_id",
            type: "int",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "order_items",
      new TableForeignKey({
        columnNames: ["order_id"],
        referencedTableName: "orders",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "order_items",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedTableName: "products",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("order_items");
    if (table) {
      const foreignKeys = table.foreignKeys.filter(
        (fk) =>
          fk.columnNames.includes("order_id") ||
          fk.columnNames.includes("product_id")
      );
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey("order_items", fk);
      }
    }
    await queryRunner.dropTable("order_items");
  }
}
