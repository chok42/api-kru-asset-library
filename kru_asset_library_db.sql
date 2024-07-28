-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 28, 2024 at 08:26 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kru_asset_library_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `mas_agency`
--

CREATE TABLE `mas_agency` (
  `agency_id` char(1) NOT NULL COMMENT 'ไอดี',
  `agency_name` varchar(250) DEFAULT NULL COMMENT 'สถาบัน'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `mas_agency`
--

INSERT INTO `mas_agency` (`agency_id`, `agency_name`) VALUES
('1', 'มหาวิทยาลัยราชภัฏกาญจนบุรี');

-- --------------------------------------------------------

--
-- Table structure for table `mas_asset_status`
--

CREATE TABLE `mas_asset_status` (
  `asset_status_id` char(1) NOT NULL COMMENT 'ไอดี',
  `asset_status_name` varchar(100) DEFAULT NULL COMMENT 'สถานะ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `mas_asset_status`
--

INSERT INTO `mas_asset_status` (`asset_status_id`, `asset_status_name`) VALUES
('1', 'ปกติ'),
('2', 'เสีย'),
('3', 'ส่งซ่อม');

-- --------------------------------------------------------

--
-- Table structure for table `mas_asset_type`
--

CREATE TABLE `mas_asset_type` (
  `asset_type_id` int(11) NOT NULL COMMENT 'ไอดี',
  `asset_type_name` varchar(100) DEFAULT NULL COMMENT 'ประเภทครุภัณฑ์'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `mas_asset_type`
--

INSERT INTO `mas_asset_type` (`asset_type_id`, `asset_type_name`) VALUES
(1, 'Notebook');

-- --------------------------------------------------------

--
-- Table structure for table `mas_employee`
--

CREATE TABLE `mas_employee` (
  `emp_id` int(11) NOT NULL COMMENT 'ไอดี',
  `emp_username` varchar(50) DEFAULT NULL COMMENT 'ชื่อผู้ใช้งาน',
  `emp_password` varchar(50) DEFAULT NULL COMMENT 'รหัสผ่าน',
  `emp_firstname` varchar(100) DEFAULT NULL COMMENT 'ชื่อจริง',
  `emp_lastname` varchar(100) DEFAULT NULL COMMENT 'นามสกุล',
  `emp_phone` varchar(10) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์',
  `emp_email` varchar(150) DEFAULT NULL COMMENT 'อีเมล',
  `emp_status` char(1) DEFAULT NULL COMMENT 'สถานะ 0 ไม่ได้ใช้งาน  1 ใช้งาน',
  `role_id` char(1) DEFAULT NULL COMMENT 'บทบาท'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `mas_employee`
--

INSERT INTO `mas_employee` (`emp_id`, `emp_username`, `emp_password`, `emp_firstname`, `emp_lastname`, `emp_phone`, `emp_email`, `emp_status`, `role_id`) VALUES
(1, 'pchok', '81DC9BDB52D04DC20036DBD8313ED055', 'sathaporn', 'bunkoed', '0982577542', 'sathaporn.chok42@gmail.com', '1', '1');

-- --------------------------------------------------------

--
-- Table structure for table `mas_role`
--

CREATE TABLE `mas_role` (
  `role_id` char(1) NOT NULL COMMENT 'ไอดี',
  `role_name` varchar(50) NOT NULL COMMENT 'บทบาท'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `mas_role`
--

INSERT INTO `mas_role` (`role_id`, `role_name`) VALUES
('1', 'ADMIN');

-- --------------------------------------------------------

--
-- Table structure for table `trans_asset`
--

CREATE TABLE `trans_asset` (
  `asset_id` int(11) NOT NULL COMMENT 'ไอดี',
  `asset_code` varchar(100) DEFAULT NULL COMMENT 'เลขที่ครุภัณฑ์',
  `asset_name` varchar(250) DEFAULT NULL COMMENT 'ชื่อ',
  `asset_model` varchar(100) DEFAULT NULL COMMENT 'รุ่น',
  `asset_brand` varchar(100) DEFAULT NULL COMMENT 'ยี่ห้อ',
  `asset_description` text DEFAULT NULL COMMENT 'คำอธิบาย',
  `asset_price` decimal(8,2) DEFAULT NULL COMMENT 'ราคา',
  `asset_creation_date` datetime DEFAULT NULL COMMENT 'วันที่สร้าง',
  `asset_start_date` datetime DEFAULT NULL COMMENT 'วันที่ใช้งาน ',
  `asset_building_code` varchar(50) DEFAULT NULL COMMENT 'รหัสอาคาร - ห้อง',
  `asset_image` text DEFAULT NULL COMMENT 'รูปภาพ',
  `asset_is_used` char(1) DEFAULT NULL COMMENT '0 ไม่ได้ใช้งาน 1 ใช้งาน',
  `asset_status_id` char(1) DEFAULT NULL COMMENT 'สถานะครุภัณฑ์',
  `agency_id` char(1) DEFAULT NULL COMMENT 'สถาบัน',
  `asset_type_id` int(11) DEFAULT NULL COMMENT 'ประเภท'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `trans_asset`
--

INSERT INTO `trans_asset` (`asset_id`, `asset_code`, `asset_name`, `asset_model`, `asset_brand`, `asset_description`, `asset_price`, `asset_creation_date`, `asset_start_date`, `asset_building_code`, `asset_image`, `asset_is_used`, `asset_status_id`, `agency_id`, `asset_type_id`) VALUES
(1, '12346', 'Notebook Asus Vivobook 16', 'Vivobook 16 X1605VA-MB549WF (15.6) Indie Black A0160423', 'Asus', 'ASUS Vivobook 16 แล็ปท็อปที่อัดแน่นด้วยคุณสมบัติ อาทิเช่น บานพับแบบวางราบได้ 180° เว็บแคมชิลล์ และปุ่มฟังก์ชันไว้เปิดหรือปิดไมค์ แล็ปท็อปจะสะอาด ปลอดภัยด้วย ASUS Antimicrobial Guard Plus ยับยั้งและป้องกันไวรัสและแบคทีเรียบริเวณคีย์บอร์ดและตัวเครื่องมีความแข็งแรง ทนทาน ผ่านมาตรฐานกองทัพ เพลิดเพลินไปกับพลังที่ลื่นไหลของ Vivobook 16!', 22990.00, '2024-07-28 10:40:33', '2024-07-28 10:00:00', 'HA102', '', '0', '2', '1', 1),
(2, '12345', 'Notebook Asus Vivobook 16 X1605VA-MB549WF (15.6) Indie Black A0160423', 'Vivobook 16 X1605VA-MB549WF (15.6) Indie Black A0160423', 'Asus', 'ASUS Vivobook 16 แล็ปท็อปที่อัดแน่นด้วยคุณสมบัติ อาทิเช่น บานพับแบบวางราบได้ 180° เว็บแคมชิลล์ และปุ่มฟังก์ชันไว้เปิดหรือปิดไมค์ แล็ปท็อปจะสะอาด ปลอดภัยด้วย ASUS Antimicrobial Guard Plus ยับยั้งและป้องกันไวรัสและแบคทีเรียบริเวณคีย์บอร์ดและตัวเครื่องมีความแข็งแรง ทนทาน ผ่านมาตรฐานกองทัพ เพลิดเพลินไปกับพลังที่ลื่นไหลของ Vivobook 16!', 22990.00, '2024-07-28 10:41:33', '2024-07-28 10:00:00', 'HA102', '', '1', '1', '1', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mas_agency`
--
ALTER TABLE `mas_agency`
  ADD PRIMARY KEY (`agency_id`);

--
-- Indexes for table `mas_asset_status`
--
ALTER TABLE `mas_asset_status`
  ADD PRIMARY KEY (`asset_status_id`);

--
-- Indexes for table `mas_asset_type`
--
ALTER TABLE `mas_asset_type`
  ADD PRIMARY KEY (`asset_type_id`);

--
-- Indexes for table `mas_employee`
--
ALTER TABLE `mas_employee`
  ADD PRIMARY KEY (`emp_id`);

--
-- Indexes for table `mas_role`
--
ALTER TABLE `mas_role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `trans_asset`
--
ALTER TABLE `trans_asset`
  ADD PRIMARY KEY (`asset_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mas_asset_type`
--
ALTER TABLE `mas_asset_type`
  MODIFY `asset_type_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ไอดี', AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `trans_asset`
--
ALTER TABLE `trans_asset`
  MODIFY `asset_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ไอดี', AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
