import { MigrationInterface, QueryRunner } from "typeorm";

export class New1692261300038 implements MigrationInterface {
    name = 'New1692261300038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "joining_date"`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "joining_date" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "joining_date"`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "joining_date" TIMESTAMP NOT NULL`);
    }

}
