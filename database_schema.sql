/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: mybasiccrm_yedek
-- ------------------------------------------------------
-- Server version	10.11.13-MariaDB-ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CONTACT`
--

DROP TABLE IF EXISTS `CONTACT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `CONTACT` (
  `ID` int(10) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci NOT NULL,
  `CONTROLNAME` varchar(10) GENERATED ALWAYS AS (replace(replace(replace(replace(replace(replace(lcase(substr(replace(`NAME`,' ',''),1,10)),'ü','u'),'ğ','g'),'ı','i'),'ş','s'),'ç','c'),'ö','o')) STORED,
  `TYPE` set('P','O') CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci NOT NULL,
  `TITLE` varchar(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `JOBTITLE` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `ADDRESS` varchar(500) DEFAULT NULL,
  `CITY` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `STATE` char(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `COUNTRY` char(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `ZIP` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `PARENTCONTACTID` int(10) DEFAULT NULL,
  `PARENTCONTACTNAME` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci NOT NULL DEFAULT '',
  `NOTE` text CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `ORGANIZATIONTYPEID` int(10) NOT NULL DEFAULT 0,
  `ORID` int(10) NOT NULL,
  `USERID` int(10) NOT NULL,
  `DATETIME` datetime NOT NULL,
  `DATETIMEEDIT` datetime NOT NULL,
  `USERIDEDIT` int(10) NOT NULL,
  `GOOGLEID` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci DEFAULT NULL,
  `POSITION` varchar(200) NOT NULL,
  `COORDINATE` varchar(100) NOT NULL,
  `STAMP` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ORID`,`ID`),
  KEY `DATETIME` (`DATETIME`),
  KEY `NAME` (`NAME`),
  KEY `OTYPEID` (`ORGANIZATIONTYPEID`),
  KEY `PCONTACTID` (`PARENTCONTACTID`),
  KEY `USERIDEDIT` (`USERIDEDIT`),
  KEY `CONTROLNAME` (`CONTROLNAME`),
  KEY `DATETIMEEDIT` (`DATETIMEEDIT`),
  KEY `STAMP` (`STAMP`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci
 PARTITION BY HASH (`ORID`)
PARTITIONS 24;
/*!40101 SET character_set_client = @saved_cs_client */;