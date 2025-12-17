/*
  Warnings:

  - You are about to drop the column `contactInfo` on the `Listing` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('NONE', 'EMAIL', 'PHONE', 'BOTH');

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "contactInfo",
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactMethod" "ContactMethod" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "contactPhone" TEXT;
