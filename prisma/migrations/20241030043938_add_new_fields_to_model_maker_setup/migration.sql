/*
  Warnings:

  - Added the required column `guidelines` to the `ModelMakerSetup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleToAssign` to the `ModelMakerSetup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ModelMakerSetup` ADD COLUMN `guidelines` VARCHAR(191) NOT NULL,
    ADD COLUMN `roleToAssign` VARCHAR(191) NOT NULL;
