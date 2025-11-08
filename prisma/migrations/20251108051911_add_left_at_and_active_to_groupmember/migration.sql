-- AlterTable
ALTER TABLE "public"."GroupMember" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "leftAt" TIMESTAMP(3);
