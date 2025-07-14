-- CreateTable
CREATE TABLE `estadisticas_vinedo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATE NOT NULL,
    `humedad_med` DECIMAL(5, 2) NULL,
    `temperatura_med` DECIMAL(5, 2) NULL,
    `temperatura_max` DECIMAL(5, 2) NULL,
    `temperatura_min` DECIMAL(5, 2) NULL,
    `precipitacion_mm` DECIMAL(5, 2) NULL,
    `sector` VARCHAR(50) NULL,
    `plantacion` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
