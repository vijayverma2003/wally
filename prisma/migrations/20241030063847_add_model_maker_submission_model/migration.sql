-- CreateTable
CREATE TABLE `ModelMakerSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `technology` VARCHAR(191) NULL,
    `extraction` VARCHAR(191) NULL,
    `modelName` VARCHAR(191) NULL,
    `epochs` INTEGER NULL,
    `modelLink` VARCHAR(191) NULL,
    `demoFileLink` VARCHAR(191) NULL,
    `imageLink` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
