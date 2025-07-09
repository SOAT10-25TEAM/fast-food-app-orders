import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class CreateProductsCategoryRelation1670000000003
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      "products",
      new TableForeignKey({
        columnNames: ["category_id"],
        referencedTableName: "categories",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const foreignKeys = await queryRunner.getTable("products").then((table) => {
      return table?.foreignKeys.filter((fk) =>
        fk.columnNames.includes("category_id")
      );
    });

    if (foreignKeys) {
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey("products", fk);
      }
    }
  }
}
