/*
  Warnings:

  - The values [LOW,MEDIUM,HIGH] on the enum `Priority` will be removed. If these variants are still used in the database, this will fail.
  - The values [OPEN,IN_PROGRESS,CLOSED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Priority_new" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');
ALTER TABLE "Ticket" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "priority" TYPE "Priority_new" USING ("priority"::text::"Priority_new");
ALTER TYPE "Priority" RENAME TO "Priority_old";
ALTER TYPE "Priority_new" RENAME TO "Priority";
DROP TYPE "Priority_old";
ALTER TABLE "Ticket" ALTER COLUMN "priority" SET DEFAULT 'MEDIA';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('ABERTO', 'EM_ANDAMENTO', 'FECHADO');
ALTER TABLE "Ticket" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'ABERTO';
COMMIT;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'ABERTO',
ALTER COLUMN "priority" SET DEFAULT 'MEDIA';
