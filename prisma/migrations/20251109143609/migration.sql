/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('WATERING', 'FERTILIZING');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'PUSH');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fcmToken" TEXT,
ADD COLUMN     "notificationPreferences" JSONB,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT,
    "imageUrl" TEXT,
    "location" TEXT,
    "acquisitionDate" TIMESTAMP(3),
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareSchedule" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "frequencyDays" INTEGER NOT NULL,
    "timeOfDay" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareTask" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorMessage" TEXT,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Plant_userId_isDeleted_idx" ON "Plant"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "Plant_name_idx" ON "Plant"("name");

-- CreateIndex
CREATE INDEX "CareSchedule_plantId_isActive_isDeleted_idx" ON "CareSchedule"("plantId", "isActive", "isDeleted");

-- CreateIndex
CREATE INDEX "CareSchedule_nextDueDate_isActive_idx" ON "CareSchedule"("nextDueDate", "isActive");

-- CreateIndex
CREATE INDEX "CareTask_scheduleId_idx" ON "CareTask"("scheduleId");

-- CreateIndex
CREATE INDEX "CareTask_plantId_completedAt_idx" ON "CareTask"("plantId", "completedAt");

-- CreateIndex
CREATE INDEX "NotificationLog_scheduleId_sentAt_idx" ON "NotificationLog"("scheduleId", "sentAt");

-- CreateIndex
CREATE INDEX "NotificationLog_userId_sentAt_idx" ON "NotificationLog"("userId", "sentAt");

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareSchedule" ADD CONSTRAINT "CareSchedule_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareTask" ADD CONSTRAINT "CareTask_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "CareSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareTask" ADD CONSTRAINT "CareTask_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "CareSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
