-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "weatherEnabled" BOOLEAN NOT NULL DEFAULT false;
