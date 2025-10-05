/*
  Warnings:

  - A unique constraint covering the columns `[payerId,recipientId]` on the table `Settlement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Settlement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Settlement" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_payerId_recipientId_key" ON "public"."Settlement"("payerId", "recipientId");
