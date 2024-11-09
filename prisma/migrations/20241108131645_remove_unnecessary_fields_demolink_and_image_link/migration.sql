/*
  Warnings:

  - You are about to drop the column `demoFileLink` on the `ModelMakerSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `imageLink` on the `ModelMakerSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ModelMakerSubmission` DROP COLUMN `demoFileLink`,
    DROP COLUMN `imageLink`;
