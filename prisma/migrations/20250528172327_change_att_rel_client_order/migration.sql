/*
  Warnings:

  - You are about to drop the column `brand` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `expDate` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `last4` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeToken]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeToken` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Product_adminId_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "brand",
DROP COLUMN "expDate",
DROP COLUMN "last4",
DROP COLUMN "token",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "method" TEXT NOT NULL,
ADD COLUMN     "stripeToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_stripeToken_key" ON "Client"("stripeToken");

-- CreateIndex
CREATE UNIQUE INDEX "Order_clientId_key" ON "Order"("clientId");
