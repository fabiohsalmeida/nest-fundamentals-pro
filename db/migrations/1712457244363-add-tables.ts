import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTables1712457244363 implements MigrationInterface {
    name = 'AddTables1712457244363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_account" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "twoFASecret" text, "enable2FA" boolean NOT NULL DEFAULT false, "apiKey" text, "phone" character varying NOT NULL, CONSTRAINT "UQ_56a0e4bcec2b5411beafa47ffa5" UNIQUE ("email"), CONSTRAINT "PK_6acfec7285fdf9f463462de3e9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "artist" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "REL_3c2c776c0a094c15d6c165494c" UNIQUE ("userId"), CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "songs" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "releasedDate" date NOT NULL, "duration" TIME NOT NULL, "lyrics" text, "playlistId" integer, CONSTRAINT "PK_e504ce8ad2e291d3a1d8f1ea2f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlist" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_538c2893e2024fabc7ae65ad142" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "songs_artists" ("songsId" integer NOT NULL, "artistId" integer NOT NULL, CONSTRAINT "PK_ecdf6d49b2a0ad917ee235cb058" PRIMARY KEY ("songsId", "artistId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_971d95bf6df45f2b07c317b6b3" ON "songs_artists" ("songsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_96b0b944763714051934dfa3ae" ON "songs_artists" ("artistId") `);
        await queryRunner.query(`ALTER TABLE "artist" ADD CONSTRAINT "FK_3c2c776c0a094c15d6c165494c0" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "FK_46fc694bda96d0127f5a8ec3720" FOREIGN KEY ("playlistId") REFERENCES "playlist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist" ADD CONSTRAINT "FK_92ca9b9b5394093adb6e5f55c4b" FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_971d95bf6df45f2b07c317b6b34" FOREIGN KEY ("songsId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_96b0b944763714051934dfa3aea" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_96b0b944763714051934dfa3aea"`);
        await queryRunner.query(`ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_971d95bf6df45f2b07c317b6b34"`);
        await queryRunner.query(`ALTER TABLE "playlist" DROP CONSTRAINT "FK_92ca9b9b5394093adb6e5f55c4b"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_46fc694bda96d0127f5a8ec3720"`);
        await queryRunner.query(`ALTER TABLE "artist" DROP CONSTRAINT "FK_3c2c776c0a094c15d6c165494c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96b0b944763714051934dfa3ae"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_971d95bf6df45f2b07c317b6b3"`);
        await queryRunner.query(`DROP TABLE "songs_artists"`);
        await queryRunner.query(`DROP TABLE "playlist"`);
        await queryRunner.query(`DROP TABLE "songs"`);
        await queryRunner.query(`DROP TABLE "artist"`);
        await queryRunner.query(`DROP TABLE "user_account"`);
    }

}
