import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsactiveString1692129999990 implements MigrationInterface {
    name = 'AddedIsactiveString1692129999990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ALTER COLUMN "is_active" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ALTER COLUMN "is_active" SET NOT NULL`);
    }

}
