-- AlterTable
ALTER TABLE `ModelMakerSubmission` ADD COLUMN `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `submitted` BOOLEAN NULL;