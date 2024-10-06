-- CreateTable
CREATE TABLE `MessageCountChannel` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MessageCount` (
    `userId` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `messageCountChannelId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MessageCount` ADD CONSTRAINT `MessageCount_messageCountChannelId_fkey` FOREIGN KEY (`messageCountChannelId`) REFERENCES `MessageCountChannel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
