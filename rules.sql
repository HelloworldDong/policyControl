/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 50721
 Source Host           : localhost:3306
 Source Schema         : policycontrol

 Target Server Type    : MySQL
 Target Server Version : 50721
 File Encoding         : 65001

 Date: 11/06/2018 11:42:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for rules
-- ----------------------------
DROP TABLE IF EXISTS `rules`;
CREATE TABLE `rules`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `rif` json NULL,
  `rthen` json NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rules
-- ----------------------------
INSERT INTO `rules` VALUES (1, 'level_policy1', '{\"or\": [{\"a.level\": {\"gt\": 50}}]}', '[{\"a.level\": 50}, {\"b.level\": 100}]');
INSERT INTO `rules` VALUES (2, 'level_policy2', '{\"or\": [{\"a.level\": {\"gt\": 80}}, {\"b.level\": {\"lt\": 100}}]}', '[{\"a.level\": 60}]');

SET FOREIGN_KEY_CHECKS = 1;
