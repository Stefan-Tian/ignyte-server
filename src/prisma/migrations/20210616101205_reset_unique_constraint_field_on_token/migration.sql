/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VerificationToken.userId_unique";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken.token_unique" ON "VerificationToken"("token");
