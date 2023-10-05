-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2023 at 06:35 AM
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
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `source` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `train_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `seat_count` int(11) DEFAULT 1,
  `total_sum` decimal(10,2) DEFAULT 0.00,
  `booking_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `source`, `destination`, `train_id`, `booking_date`, `seat_count`, `total_sum`, `booking_id`) VALUES
(1, 'city x', 'city y', 5, '2023-09-30', 1, '40.00', 814569),
(2, 'city a', 'city b', 4, '2023-10-05', 1, '40.00', 722278),
(3, 'city a', 'city b', 4, '2023-10-05', 1, '40.00', 737515);

-- --------------------------------------------------------

--
-- Table structure for table `passengers`
--

CREATE TABLE `passengers` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `seat_type` varchar(10) DEFAULT NULL,
  `seat_number` varchar(10) DEFAULT NULL,
  `seat_class` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `passengers`
--

INSERT INTO `passengers` (`id`, `booking_id`, `name`, `age`, `gender`, `address`, `seat_type`, `seat_number`, `seat_class`) VALUES
(1, 814569, 'wdq', 21, 'male', 'wqedwee', 'm', '30', 'sleeper'),
(2, 722278, 'alan', 21, 'male', 'bangalore', 'l', '35', 'sleeper'),
(3, 737515, 'payal', 21, 'male', 'bangalore', 'u', '35', 'sleeper');

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
(1, 'Express Train 1', 'City A', 'City B', '08:00:00', '12:00:00', 100, 100, 100),
(2, 'Local Train 1', 'City A', 'City B', '10:00:00', '14:00:00', 100, 100, 100),
(3, 'Express Train 2', 'City X', 'City Y', '09:00:00', '13:00:00', 100, 100, 100),
(4, 'Local Train 2', 'City A', 'City B', '11:30:00', '15:30:00', 98, 100, 100),
(5, 'Express Train 3', 'City X', 'City Y', '10:30:00', '14:30:00', 99, 100, 100);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `train_id` (`train_id`);

--
-- Indexes for table `passengers`
--
ALTER TABLE `passengers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trains`
--
ALTER TABLE `trains`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `passengers`
--
ALTER TABLE `passengers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `trains`
--
ALTER TABLE `trains`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`train_id`) REFERENCES `trains` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
