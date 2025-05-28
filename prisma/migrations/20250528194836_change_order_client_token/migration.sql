/*
  Warnings:

  - You are about to drop the column `stripeToken` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeMethodId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeIntentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeMethodId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeIntentId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Client_stripeToken_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "stripeToken",
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "stripeMethodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "stripeIntentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_stripeMethodId_key" ON "Client"("stripeMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeIntentId_key" ON "Order"("stripeIntentId");
