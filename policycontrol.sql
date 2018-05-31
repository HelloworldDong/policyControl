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

 Date: 10/05/2018 17:04:18
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for rules
-- ----------------------------
DROP TABLE IF EXISTS `rules`;
CREATE TABLE `rules`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `if` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `then` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rules
-- ----------------------------
INSERT INTO `rules` VALUES (1, '[\'088C\'].light<20', 'ON 0854');
INSERT INTO `rules` VALUES (2, '[\'0854\'].on==true', 'SET 088C light 20');
INSERT INTO `rules` VALUES (3, '[\'0880\'].on==true&&[\'088C\'].light>50', 'OFF 088C');

-- ----------------------------
-- Table structure for states
-- ----------------------------
DROP TABLE IF EXISTS `states`;
CREATE TABLE `states`  (
  `id` int(11) NOT NULL,
  `devID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `light` int(255) NULL DEFAULT NULL,
  `on` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of states
-- ----------------------------
INSERT INTO `states` VALUES (1, '088C', 50, 1);
INSERT INTO `states` VALUES (2, '0854', 0, 0);
INSERT INTO `states` VALUES (3, '0880', 80, 1);

SET FOREIGN_KEY_CHECKS = 1;
