import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class CriaCampoCodeOrder1741212727230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("orders", [
      new TableColumn({
        name: "code",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "paymentStatus",
        type: "varchar",
        isNullable: false,
        default: "'PENDING'",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("orders", "code");
    await queryRunner.dropColumn("orders", "paymentStatus");
  }
}
