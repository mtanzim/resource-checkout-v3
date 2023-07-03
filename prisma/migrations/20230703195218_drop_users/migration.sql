/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ResourceGroupToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ResourceGroupToUser" DROP CONSTRAINT "_ResourceGroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ResourceGroupToUser" DROP CONSTRAINT "_ResourceGroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "currentOwner" TEXT;

-- AlterTable
ALTER TABLE "ResourceGroup" ADD COLUMN     "admins" TEXT[],
ADD COLUMN     "users" TEXT[];

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_ResourceGroupToUser";
