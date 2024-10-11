-- CreateTable
CREATE TABLE `Usuario` (
    `Num_empleado` INTEGER NOT NULL,
    `Nombre` VARCHAR(191) NOT NULL,
    `Apellido` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `CUIL` VARCHAR(191) NOT NULL,
    `Dirrecion` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `rol` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Usuario_Num_empleado_key`(`Num_empleado`),
    UNIQUE INDEX `Usuario_Email_key`(`Email`),
    UNIQUE INDEX `Usuario_CUIL_key`(`CUIL`),
    PRIMARY KEY (`Num_empleado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Informe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `contenido` VARCHAR(191) NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_final` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlanDeRiego` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inicio` DATETIME(3) NOT NULL,
    `fin` DATETIME(3) NOT NULL,
    `idInforme` INTEGER NOT NULL,

    UNIQUE INDEX `PlanDeRiego_idInforme_key`(`idInforme`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiaPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaDia` DATETIME(3) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `color` VARCHAR(7) NOT NULL,
    `idPlan` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanDeRiego` ADD CONSTRAINT `PlanDeRiego_idInforme_fkey` FOREIGN KEY (`idInforme`) REFERENCES `Informe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiaPlan` ADD CONSTRAINT `DiaPlan_idPlan_fkey` FOREIGN KEY (`idPlan`) REFERENCES `PlanDeRiego`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
