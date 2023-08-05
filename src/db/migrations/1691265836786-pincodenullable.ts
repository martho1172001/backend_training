import { MigrationInterface, QueryRunner } from "typeorm";

export class Pincodenullable1691265836786 implements MigrationInterface {
    name = 'Pincodenullable1691265836786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "line1" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "pincode" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "pincode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "line1" SET NOT NULL`);
    }

}
