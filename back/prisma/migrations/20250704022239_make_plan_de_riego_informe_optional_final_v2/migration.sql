/*
  Warnings:

  - You are about to alter the column `fecha_inicio` on the `informe` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Date`.
  - You are about to alter the column `fecha_final` on the `informe` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Date`.

*/
-- DropForeignKey
ALTER TABLE `diaplan` DROP FOREIGN KEY `DiaPlan_idPlan_fkey`;

-- DropForeignKey
ALTER TABLE `imagenesinforme` DROP FOREIGN KEY `ImagenesInforme_idInforme_fkey`;

-- DropForeignKey
ALTER TABLE `planderiego` DROP FOREIGN KEY `PlanDeRiego_idInforme_fkey`;

-- AlterTable
ALTER TABLE `diaplan` MODIFY `fechaDia` DATE NOT NULL,
    MODIFY `titulo` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `imagenesinforme` MODIFY `url` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `informe` MODIFY `titulo` VARCHAR(255) NOT NULL,
    MODIFY `contenido` TEXT NOT NULL,
    MODIFY `fecha_inicio` DATE NOT NULL,
    MODIFY `fecha_final` DATE NOT NULL;

-- AlterTable
ALTER TABLE `planderiego` MODIFY `titulo` VARCHAR(255) NOT NULL,
    MODIFY `inicio` DATE NOT NULL,
    MODIFY `fin` DATE NOT NULL,
    MODIFY `idInforme` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `imagenesInforme` ADD CONSTRAINT `imagenesInforme_idInforme_fkey` FOREIGN KEY (`idInforme`) REFERENCES `Informe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planDeRiego` ADD CONSTRAINT `planDeRiego_idInforme_fkey` FOREIGN KEY (`idInforme`) REFERENCES `Informe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diaPlan` ADD CONSTRAINT `diaPlan_idPlan_fkey` FOREIGN KEY (`idPlan`) REFERENCES `planDeRiego`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `planderiego` RENAME INDEX `PlanDeRiego_idInforme_key` TO `planDeRiego_idInforme_key`;
