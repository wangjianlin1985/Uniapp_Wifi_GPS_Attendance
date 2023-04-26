-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        8.0.28 - MySQL Community Server - GPL
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- 导出 course 的数据库结构
CREATE DATABASE IF NOT EXISTS `course` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `course`;

-- 导出  表 course.course 结构
CREATE TABLE IF NOT EXISTS `course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0' COMMENT '课程名',
  `date` int NOT NULL DEFAULT '0' COMMENT '星期几',
  `begintime` time NOT NULL COMMENT '上课时间',
  `endtime` time NOT NULL COMMENT '下课时间',
  `location` int NOT NULL COMMENT '上课地点ID',
  `wifi` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'unknown ssid' COMMENT '签到所需WIFI',
  `condition` int DEFAULT '0' COMMENT '签到条件',
  PRIMARY KEY (`id`),
  KEY `FK_courses_location` (`location`),
  CONSTRAINT `FK_courses_location` FOREIGN KEY (`location`) REFERENCES `location` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='课程表';

-- 正在导出表  course.course 的数据：~3 rows (大约)
DELETE FROM `course`;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` (`id`, `name`, `date`, `begintime`, `endtime`, `location`, `wifi`, `condition`) VALUES
	(1, '测试课程', 0, '14:16:01', '23:00:00', 1, 'unknown ssid', 3),
	(2, '测试课程2', 0, '14:16:01', '23:00:00', 2, 'TPLink', 3),
	(3, '测试课程3', 1, '14:16:01', '23:00:00', 2, 'TPLink', 1),
	(4, '测试课程4', 3, '14:23:33', '23:00:00', 1, 'unknown ssid', 1);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;

-- 导出  表 course.location 结构
CREATE TABLE IF NOT EXISTS `location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '0' COMMENT '上课地点',
  `x` varchar(30) NOT NULL DEFAULT '0' COMMENT '纬度',
  `y` varchar(30) NOT NULL DEFAULT '0' COMMENT '经度',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='上课地点';

-- 正在导出表  course.location 的数据：~2 rows (大约)
DELETE FROM `location`;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` (`id`, `name`, `x`, `y`) VALUES
	(1, '测试教室01', '116.397482', '39.909204'),
	(2, '测试教室02', '116.397391', '39.91057');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;

-- 导出  表 course.selection 结构
CREATE TABLE IF NOT EXISTS `selection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL DEFAULT '0',
  `course_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_selection_course` (`course_id`),
  KEY `FK_selection_user` (`user_id`),
  CONSTRAINT `FK_selection_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_selection_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='选课表';

-- 正在导出表  course.selection 的数据：~2 rows (大约)
DELETE FROM `selection`;
/*!40000 ALTER TABLE `selection` DISABLE KEYS */;
INSERT INTO `selection` (`id`, `user_id`, `course_id`) VALUES
	(1, 2, 1),
	(2, 2, 2),
	(3, 2, 3);
/*!40000 ALTER TABLE `selection` ENABLE KEYS */;

-- 导出  表 course.signin 结构
CREATE TABLE IF NOT EXISTS `signin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `time` datetime NOT NULL COMMENT '签到时间',
  `location_x` varchar(50) NOT NULL,
  `location_y` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_signin_user` (`user_id`),
  KEY `FK_signin_course` (`course_id`),
  CONSTRAINT `FK_signin_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `FK_signin_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='签到表';

-- 正在导出表  course.signin 的数据：~1 rows (大约)
DELETE FROM `signin`;
/*!40000 ALTER TABLE `signin` DISABLE KEYS */;
/*!40000 ALTER TABLE `signin` ENABLE KEYS */;

-- 导出  表 course.user 结构
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(50) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `isAdmin` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  course.user 的数据：~9 rows (大约)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `username`, `password`, `nickname`, `isAdmin`) VALUES
	(1, '1111', '1111', '系统管理员', 1),
	(2, '2222', '2222', '测试用户', 0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
