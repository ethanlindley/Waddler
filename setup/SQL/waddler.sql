DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
    `ID` int(10) UNSIGNED NOT NULL,
    `itemID` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `inventory` WRITE;
INSERT INTO `inventory` VALUES (100, 1);
INSERT INTO `inventory` VALUES (101, 1);
UNLOCK TABLES;

DROP TABLE IF EXISTS `furniture`;
CREATE TABLE `furniture` (
    `ID` int(10) UNSIGNED NOT NULL,
    `furnitureID` int(10) UNSIGNED NOT NULL,
    `quantity` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `furniture` WRITE;
INSERT INTO `furniture` VALUES (100, 572, 1);
INSERT INTO `furniture` VALUES (101, 572, 1);
UNLOCK TABLES;

DROP TABLE IF EXISTS `igloo`;
CREATE TABLE `igloo` (
    `ID` int(10) UNSIGNED NOT NULL,
    `music` int(10) UNSIGNED NOT NULL DEFAULT 0,
    `floor` int(10) UNSIGNED NOT NULL DEFAULT 0,
    `furniture` longtext NOT NULL,
    `locked` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
    `type` int(10) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `igloo` WRITE;
INSERT INTO `igloo` VALUES (100, 0, 14, '572', 0, 1);
INSERT INTO `igloo` VALUES (101, 0, 14, '572', 0, 1);
UNLOCK TABLES;

DROP TABLE IF EXISTS `ignored`;
CREATE TABLE `ignored` (
    `ID` int(10) UNSIGNED NOT NULL,
    `ignoredID` int(10) UNSIGNED NOT NULL,
    `ignoredUsername` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `buddies`;
CREATE TABLE `buddies` (
    `ID` int(10) UNSIGNED NOT NULL,
    `buddyID` int(10) UNSIGNED NOT NULL,
    `buddyUsername` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `stamps`;
CREATE TABLE `stamps` (
    `ID` int(10) UNSIGNED NOT NULL,
    `stampID` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `stamps` WRITE;
INSERT INTO `stamps` VALUES (100, 7);
INSERT INTO `stamps` VALUES (100, 8);
UNLOCK TABLES;

DROP TABLE IF EXISTS `puffles`;
CREATE TABLE `puffles` (
    `ID` int(10) UNSIGNED NOT NULL,
    `puffleID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `puffleName` varchar(16) NOT NULL,
    `puffleType` tinyint(3) UNSIGNED NOT NULL,
    `puffleFood` tinyint(3) UNSIGNED NOT NULL,
    `pufflePlay` tinyint(3) UNSIGNED NOT NULL,
    `puffleRest` tinyint(3) UNSIGNED NOT NULL,
    `puffleWalk` tinyint(4) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`puffleID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

LOCK TABLES `puffles` WRITE;
INSERT INTO `puffles` VALUES (100, 10, 'Slave', 1, 100, 100, 100, 0);
UNLOCK TABLES;

DROP TABLE IF EXISTS `penguins`;
CREATE TABLE `penguins` (
    `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` varchar(12) NOT NULL,
    `password` char(255) NOT NULL,
    `loginKey` char(255) NOT NULL,
    `registrationDate` varchar(8) NOT NULL,
    `banned` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
    `moderator` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
    `rank` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
    `coins` mediumint(8) UNSIGNED NOT NULL DEFAULT 500,
    `color` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
    `head` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
    `face` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
    `neck` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
    `body` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
    `hand` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
    `feet` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
    `pin` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
    `photo` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
    `igloos` longtext NOT NULL,
    `cover` longtext NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;

LOCK TABLES `penguins` WRITE;
INSERT INTO `penguins` (`ID`, `username`, `password`, `loginKey`, `registrationDate`, `coins`, `moderator`, `igloos`, `cover`) VALUES (100, 'Zaseth', '43244635c14605fdbe23fa89b5cf12bd14a14bfb9420f66788dd6914a31d8c7b', '', '20180808', 99999, 1, '1|22|23', '1%1%1%1%');
INSERT INTO `penguins` (`ID`, `username`, `password`, `loginKey`, `registrationDate`, `coins`, `moderator`, `igloos`, `cover`) VALUES (101, 'Daan', '43244635c14605fdbe23fa89b5cf12bd14a14bfb9420f66788dd6914a31d8c7b', '', '20180808', 99999, 1, '1', '1%1%1%1%');
UNLOCK TABLES;