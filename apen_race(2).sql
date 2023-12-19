-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 19, 2023 at 10:46 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `apen_race`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` int(10) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `language` varchar(255) NOT NULL,
  `difficulty` varchar(255) NOT NULL,
  `profilePhoto` varchar(255) NOT NULL,
  `permissions` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `user_name`, `email`, `user_pass`, `language`, `difficulty`, `profilePhoto`, `permissions`) VALUES
(1, 'Serluna', 'db01@ziggo.nl', '$2b$10$CDoOuVyZkvYoqjh8pXyYD.kq0FHzIFcEUXTECXHpe2odcixyeIdM6', 'nl', 'niv1', 'public/userPhotos/serluna.jpg', 'leerling'),
(3, 'kokloler', 'jelte.kessels@gmail.com', '$2b$10$6FsQ4IwpJ/zTe6JdAE44uerg1/PHQmXuBXDRYEN91/upVCBVwXTRm', 'nl', 'niv1', '', 'leerling'),
(4, 'SuperCMaster', 'igorlaska5g@gmail.com', '$2b$10$RnZiTLwbcDAHkeIKJsEHA.K3utTKpdUxFpFILNOWeIZqDJbbHegum', 'nl', 'niv1', '', 'leerling'),
(25, 'halloe', 'dikkeaap@ja.com', '$2b$10$cDJFs5lxqfp4DDQ8sxNnZ.8vtzFcrnu.y5fsxpWkCn0jEAjBAeJF2', 'nl', 'niv1', '', 'leerling'),
(41, 'koen', 'koen@ictgilde.com', '$2b$10$CDoOuVyZkvYoqjh8pXyYD.kq0FHzIFcEUXTECXHpe2odcixyeIdM6', 'nl', 'niv1', '', 'docent');

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `id` int(255) NOT NULL,
  `user_name` varchar(16) NOT NULL,
  `wins` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leaderboard`
--

INSERT INTO `leaderboard` (`id`, `user_name`, `wins`) VALUES
(1, 'Serluna', 69420),
(2, 'kokloler', 69),
(3, 'SuperCMaster', 68);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_name` (`user_name`);

--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_name` (`user_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `leaderboard_ibfk_1` FOREIGN KEY (`user_name`) REFERENCES `account` (`user_name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
