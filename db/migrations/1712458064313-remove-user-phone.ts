import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserPhone1712458064313 implements MigrationInterface {
    name = 'RemoveUserPhone1712458064313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" ADD "phone" character varying NOT NULL`);
    }

}
