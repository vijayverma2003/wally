/*
  Warnings:

  - A unique constraint covering the columns `[channelId,date]` on the table `ChannelActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,date]` on the table `StaffActivity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ChannelActivity_channelId_date_key` ON `ChannelActivity`(`channelId`, `date`);

-- CreateIndex
CREATE UNIQUE INDEX `StaffActivity_userId_date_key` ON `StaffActivity`(`userId`, `date`);
