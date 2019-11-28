-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema globalgamejam
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema globalgamejam
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `globalgamejam` DEFAULT CHARACTER SET utf8 ;
USE `globalgamejam` ;

-- -----------------------------------------------------
-- Table `globalgamejam`.`tblPerson`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblPerson` (
  `idPerson` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dtFirstName` VARCHAR(254) NOT NULL,
  `dtLastName` VARCHAR(254) NOT NULL,
  `dtPassword` VARCHAR(254) NOT NULL,
  `dtEmail` VARCHAR(254) NOT NULL,
  PRIMARY KEY (`idPerson`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblAdmin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblAdmin` (
  `idAdmin` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dtIsGranted` TINYINT NULL DEFAULT 0,
  `fiPerson` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idAdmin`),
  INDEX `fiAdmin_idx` (`fiPerson` ASC) VISIBLE,
  CONSTRAINT `fkAdmin_Person`
    FOREIGN KEY (`fiPerson`)
    REFERENCES `globalgamejam`.`tblPerson` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblLocation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblLocation` (
  `idLocation` INT UNSIGNED NOT NULL,
  `dtName` VARCHAR(128) NOT NULL,
  `dtAddress` VARCHAR(128) NOT NULL,
  `dtPhone` VARCHAR(128) NULL,
  `dtWebsite` VARCHAR(254) NULL,
  `dtRoom` VARCHAR(128) NULL,
  PRIMARY KEY (`idLocation`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblEvent`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblEvent` (
  `idEvent` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dtStartingDate` DATETIME NOT NULL,
  `dtEndingDate` DATETIME NOT NULL,
  `dtIBAN` VARCHAR(35) NULL,
  `fiLocation` INT UNSIGNED NULL,
  `dtPaymentAmount` VARCHAR(10) NULL,
  PRIMARY KEY (`idEvent`),
  INDEX `fiLocation_idx` (`fiLocation` ASC) VISIBLE,
  CONSTRAINT `fkLocation_Event`
    FOREIGN KEY (`fiLocation`)
    REFERENCES `globalgamejam`.`tblLocation` (`idLocation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblGroup`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblGroup` (
  `idGroup` INT UNSIGNED NOT NULL,
  `dtName` VARCHAR(254) NULL,
  PRIMARY KEY (`idGroup`),
  UNIQUE INDEX `dtName_UNIQUE` (`dtName` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblParticipant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblParticipant` (
  `idParticipant` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dtAllergies` TEXT NULL,
  `dtTShirtSize` VARCHAR(4) NOT NULL,
  `dtSkillSet` VARCHAR(64) NOT NULL,
  `dtNewsletter` TINYINT NOT NULL DEFAULT 0,
  `dtHasPaied` TINYINT NULL DEFAULT 0,
  `fiPerson` INT UNSIGNED NOT NULL,
  `fiEvent` INT UNSIGNED NOT NULL,
  `fiGroup` INT UNSIGNED NULL,
  PRIMARY KEY (`idParticipant`),
  INDEX `fiPerson_idx` (`fiPerson` ASC) VISIBLE,
  INDEX `fiEvent_idx` (`fiEvent` ASC) VISIBLE,
  INDEX `fiGroup_idx` (`fiGroup` ASC) VISIBLE,
  CONSTRAINT `fkPerson_Participant`
    FOREIGN KEY (`fiPerson`)
    REFERENCES `globalgamejam`.`tblPerson` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fkEvent_Participant`
    FOREIGN KEY (`fiEvent`)
    REFERENCES `globalgamejam`.`tblEvent` (`idEvent`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fkGroup_Participant`
    FOREIGN KEY (`fiGroup`)
    REFERENCES `globalgamejam`.`tblGroup` (`idGroup`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblAccountant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblAccountant` (
  `idAccountant` INT NOT NULL AUTO_INCREMENT,
  `fiPerson` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idAccountant`),
  INDEX `fiAccountant_idx` (`fiPerson` ASC) VISIBLE,
  CONSTRAINT `fkAccountant_Person`
    FOREIGN KEY (`fiPerson`)
    REFERENCES `globalgamejam`.`tblPerson` (`idPerson`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblSponsor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblSponsor` (
  `idSponsor` INT UNSIGNED NOT NULL,
  `dtCompanyName` VARCHAR(254) NOT NULL,
  `fiPerson` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idSponsor`),
  INDEX `fiSponsor_idx` (`fiPerson` ASC) VISIBLE,
  CONSTRAINT `fkSponsor_Person`
    FOREIGN KEY (`fiPerson`)
    REFERENCES `globalgamejam`.`tblPerson` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblProject`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblProject` (
  `idProject` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dtProjectName` VARCHAR(254) NOT NULL,
  `dtURL` VARCHAR(254) NULL,
  `dtImageFolder` VARCHAR(128) NULL,
  `fiGroup` INT UNSIGNED NOT NULL,
  `fiEvent` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idProject`),
  INDEX `fiGroup_idx` (`fiGroup` ASC) VISIBLE,
  INDEX `fiProject_idx` (`fiEvent` ASC) VISIBLE,
  CONSTRAINT `fkGroup_Project`
    FOREIGN KEY (`fiGroup`)
    REFERENCES `globalgamejam`.`tblGroup` (`idGroup`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fkEvent_Project`
    FOREIGN KEY (`fiEvent`)
    REFERENCES `globalgamejam`.`tblEvent` (`idEvent`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblHardware`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblHardware` (
  `idHardware` INT UNSIGNED NOT NULL,
  `dtName` VARCHAR(64) NOT NULL,
  `dtPower` INT UNSIGNED NOT NULL,
  `dtOutlets` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idHardware`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblPaticipantHardware`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblPaticipantHardware` (
  `idParticipantHardware` INT NOT NULL,
  `fiHardware` INT UNSIGNED NOT NULL,
  `fiParticipant` INT UNSIGNED NOT NULL,
  `dtAmount` INT UNSIGNED NOT NULL,
  `dtNeedsLAN` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`idParticipantHardware`),
  INDEX `fiHardware_idx` (`fiHardware` ASC) VISIBLE,
  INDEX `fiParticipant_idx` (`fiParticipant` ASC) VISIBLE,
  CONSTRAINT `fkHardware_Participant`
    FOREIGN KEY (`fiHardware`)
    REFERENCES `globalgamejam`.`tblHardware` (`idHardware`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fkParticipant_Hardware`
    FOREIGN KEY (`fiParticipant`)
    REFERENCES `globalgamejam`.`tblParticipant` (`idParticipant`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `globalgamejam`.`tblUpdate`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `globalgamejam`.`tblUpdate` (
  `idUpdate` INT UNSIGNED NOT NULL,
  `fiUpdater` INT UNSIGNED NULL,
  `fiParticipant` INT UNSIGNED NULL,
  `dtUpdateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUpdate`),
  INDEX `fiUpdater_idx` (`fiUpdater` ASC) VISIBLE,
  INDEX `fiParticipant_update_idx` (`fiParticipant` ASC) VISIBLE,
  CONSTRAINT `fkUpdater_Person`
    FOREIGN KEY (`fiUpdater`)
    REFERENCES `globalgamejam`.`tblPerson` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fkParticipant_Update`
    FOREIGN KEY (`fiParticipant`)
    REFERENCES `globalgamejam`.`tblParticipant` (`idParticipant`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
