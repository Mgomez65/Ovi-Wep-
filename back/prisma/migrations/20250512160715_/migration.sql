-- DropForeignKey
ALTER TABLE `imagenesinforme` DROP FOREIGN KEY `ImagenesInforme_idInforme_fkey`;

-- DropIndex
DROP INDEX `ImagenesInforme_idInforme_fkey` ON `imagenesinforme`;

-- AddForeignKey
ALTER TABLE `ImagenesInforme` ADD CONSTRAINT `ImagenesInforme_idInforme_fkey` FOREIGN KEY (`idInforme`) REFERENCES `Informe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
