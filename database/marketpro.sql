-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-07-2026 a las 02:43:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `marketpro`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` bigint(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `descripcion`, `nombre`) VALUES
(1, 'Productos de consumo alimenticio', 'Alimentos'),
(2, 'Productos de limpieza y aseo', 'Aseo'),
(3, 'Dispositivos y productos tecnológicos', 'Tecnología'),
(4, 'Bebidas y refrescos', 'Bebidas'),
(5, 'Artículos para el hogar', 'Hogar'),
(6, NULL, 'Mascotas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `fecha_vencimiento` date DEFAULT NULL,
  `precio_compra` double NOT NULL,
  `precio_venta` double NOT NULL,
  `stock` int(11) NOT NULL,
  `categoria_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `sku` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`fecha_vencimiento`, `precio_compra`, `precio_venta`, `stock`, `categoria_id`, `id`, `nombre`, `sku`) VALUES
('2027-12-20', 2300, 3700, 120, 4, 1, 'Pepsi Zero 400 ml', 'PEP001');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `username`, `email`, `password`, `role`, `is_active`, `created_at`) VALUES
(1, 'admin', 'admin@marketpro.com', '$2a$10$R7McoG.4BUMmK7CjNqrebeXpM10Q2rT30Fky9PteG882L1R8lJz7C', 'Administrador', 1, '2026-07-10 00:41:39'),
(2, 'anderson', 'anderson1@marketpro.com', '$2a$10$R7McoG.4BUMmK7CjNqrebeXpM10Q2rT30Fky9PteG882L1R8lJz7C', 'Bodega', 1, '2026-07-10 08:02:29'),
(3, 'cristian', 'cristian@marketpro.com', '$2a$10$R7McoG.4BUMmK7CjNqrebeXpM10Q2rT30Fky9PteG882L1R8lJz7C', 'Cajero', 1, '2026-07-10 08:03:57'),
(4, 'cristina', 'cristina@marketpro.com', '$2a$10$R7McoG.4BUMmK7CjNqrebeXpM10Q2rT30Fky9PteG882L1R8lJz7C', 'Administrador', 1, '2026-07-10 08:04:47'),
(5, 'bryan', 'bryan@marketpro.com', '$2a$10$R7McoG.4BUMmK7CjNqrebeXpM10Q2rT30Fky9PteG882L1R8lJz7C', 'Bodega', 1, '2026-07-10 08:05:34');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKqcog8b7hps1hioi9onqwjdt6y` (`nombre`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK8bwvjlh8b1xi4cc4ar819q61y` (`sku`),
  ADD KEY `FK2fwq10nwymfv7fumctxt9vpgb` (`categoria_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `FK2fwq10nwymfv7fumctxt9vpgb` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
