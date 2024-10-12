-- CreateTable
CREATE TABLE `ImagenesInforme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `idInforme` INTEGER NOT NULL,

    UNIQUE INDEX `ImagenesInforme_idInforme_key`(`idInforme`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImagenesInforme` ADD CONSTRAINT `ImagenesInforme_idInforme_fkey` FOREIGN KEY (`idInforme`) REFERENCES `Informe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
