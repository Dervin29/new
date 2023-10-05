-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2023 at 07:46 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `train_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `trains`
--

CREATE TABLE `trains` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `source` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `departure_time` time NOT NULL,
  `arrival_time` time NOT NULL,
  `seats_sleeper` int(11) NOT NULL,
  `seats_ac` int(11) NOT NULL,
  `seats_general` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `trains`
--

INSERT INTO `trains` (`id`, `name`, `source`, `destination`, `departure_time`, `arrival_time`, `seats_sleeper`, `seats_ac`, `seats_general`) VALUES
(1, 'Express Train 123', 'Bangalore', 'Vellore', '08:00:00', '10:00:00', 100, 100, 100),
(2, 'Metro X', 'Vellore', 'Chennai', '09:30:00', '11:30:00', 99, 100, 100),
(3, 'Local Train', 'Bangalore', 'Chennai', '11:15:00', '13:15:00', 100, 100, 100),
(4, 'Swift Express', 'Chennai', 'Vellore', '07:45:00', '09:45:00', 98, 100, 100),
(5, 'City Connect', 'Bangalore', 'Chennai', '12:30:00', '14:30:00', 99, 100, 100),
(6, 'Super Shuttle', 'Vellore', 'Bangalore', '15:00:00', '17:00:00', 100, 100, 100),
(7, 'Express 404', 'Chennai', 'Bangalore', '16:30:00', '18:30:00', 100, 100, 100);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `trains`
--
ALTER TABLE `trains`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `trains`
--
ALTER TABLE `trains`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
