/*
  Warnings:

  - You are about to drop the column `status` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `stripeMethodId` on the `Client` table. All the data in the column will be lost.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Client_stripeMethodId_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "status",
DROP COLUMN "stripeMethodId",
ALTER COLUMN "method" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" TEXT NOT NULL;
