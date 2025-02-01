-- DropForeignKey
ALTER TABLE `ImagenesInforme` DROP FOREIGN KEY `ImagenesInforme_idInforme_fkey`;

-- DropIndex
DROP INDEX `ImagenesInforme_idInforme_key` ON `ImagenesInforme`;

-- AddForeignKey
ALTER TABLE `PlanDeRiego` ADD CONSTRAINT `PlanDeRiego_idInforme_fkey` FOREIGN KEY (`idInforme`) REFERENCES `Informe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
