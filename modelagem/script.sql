-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema feshow
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema feshow
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `feshow` DEFAULT CHARACTER SET utf8 ;
USE `feshow` ;

-- -----------------------------------------------------
-- Table `feshow`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `email` VARCHAR(30) NOT NULL,
  `image` VARCHAR(50) NULL,
  `password` VARCHAR(10) NOT NULL,
  `type` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`venues`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`venues` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `description` VARCHAR(255) NULL,
  `opening_time` TIME NULL,
  `closing_time` TIME NOT NULL,
  `first_day` CHAR(3) NOT NULL,
  `last_day` CHAR(3) NOT NULL,
  `capacity` INT NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_venues_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_venues_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `feshow`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`addresses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`addresses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `zipcode` VARCHAR(9) NOT NULL,
  `street` VARCHAR(50) NOT NULL,
  `district` VARCHAR(50) NOT NULL,
  `number` VARCHAR(5) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `uf` CHAR(2) NOT NULL,
  `venue_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_addresses_venues1_idx` (`venue_id` ASC),
  CONSTRAINT `fk_addresses_venues1`
    FOREIGN KEY (`venue_id`)
    REFERENCES `feshow`.`venues` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`artists`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`artists` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `members` INT NOT NULL,
  `description` VARCHAR(255) NULL,
  `cache` FLOAT NULL,
  `city` VARCHAR(60) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_artists_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_artists_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `feshow`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`equipments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`equipments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`artist_equipments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`artist_equipments` (
  `artist_id` INT(11) NOT NULL,
  `equipment_id` INT(11) NOT NULL,
  `number` INT NOT NULL,
  PRIMARY KEY (`artist_id`, `equipment_id`),
  INDEX `fk_artists_has_equipments_equipments1_idx` (`equipment_id` ASC),
  INDEX `fk_artists_has_equipments_artists1_idx` (`artist_id` ASC),
  CONSTRAINT `fk_artists_has_equipments_artists1`
    FOREIGN KEY (`artist_id`)
    REFERENCES `feshow`.`artists` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_artists_has_equipments_equipments1`
    FOREIGN KEY (`equipment_id`)
    REFERENCES `feshow`.`equipments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`events` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `organizer_id` INT(11) NOT NULL,
  `venue_id` INT(11) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` VARCHAR(45) NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_events_users1_idx` (`organizer_id` ASC),
  INDEX `fk_events_venues1_idx` (`venue_id` ASC),
  CONSTRAINT `fk_events_users1`
    FOREIGN KEY (`organizer_id`)
    REFERENCES `feshow`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_events_venues1`
    FOREIGN KEY (`venue_id`)
    REFERENCES `feshow`.`venues` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`artist_events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`artist_events` (
  `event_id` INT(11) NOT NULL,
  `artist_id` INT(11) NOT NULL,
  `start_time` TIME NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`event_id`, `artist_id`),
  INDEX `fk_events_has_artists_artists1_idx` (`artist_id` ASC),
  INDEX `fk_events_has_artists_events1_idx` (`event_id` ASC),
  CONSTRAINT `fk_events_has_artists_artists1`
    FOREIGN KEY (`artist_id`)
    REFERENCES `feshow`.`artists` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_events_has_artists_events1`
    FOREIGN KEY (`event_id`)
    REFERENCES `feshow`.`events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`genres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`genres` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`artist_genres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`artist_genres` (
  `artist_id` INT(11) NOT NULL,
  `genre_id` INT(11) NOT NULL,
  PRIMARY KEY (`artist_id`, `genre_id`),
  INDEX `fk_artists_has_genres_genres1_idx` (`genre_id` ASC),
  INDEX `fk_artists_has_genres_artists1_idx` (`artist_id` ASC),
  CONSTRAINT `fk_artists_has_genres_artists1`
    FOREIGN KEY (`artist_id`)
    REFERENCES `feshow`.`artists` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_artists_has_genres_genres1`
    FOREIGN KEY (`genre_id`)
    REFERENCES `feshow`.`genres` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`instruments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`instruments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`artist_instruments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`artist_instruments` (
  `artists_id` INT(11) NOT NULL,
  `instrument_id` INT(11) NOT NULL,
  `number` INT NOT NULL,
  PRIMARY KEY (`artists_id`, `instrument_id`),
  INDEX `fk_artists_has_instruments_instruments1_idx` (`instrument_id` ASC),
  INDEX `fk_artists_has_instruments_artists1_idx` (`artists_id` ASC),
  CONSTRAINT `fk_artists_has_instruments_artists1`
    FOREIGN KEY (`artists_id`)
    REFERENCES `feshow`.`artists` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_artists_has_instruments_instruments1`
    FOREIGN KEY (`instrument_id`)
    REFERENCES `feshow`.`instruments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`equipment_venues`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`equipment_venues` (
  `venue_id` INT(11) NOT NULL,
  `equipment_id` INT(11) NOT NULL,
  `number` INT NOT NULL,
  PRIMARY KEY (`venue_id`, `equipment_id`),
  INDEX `fk_venues_has_equipments_equipments1_idx` (`equipment_id` ASC),
  INDEX `fk_venues_has_equipments_venues1_idx` (`venue_id` ASC),
  CONSTRAINT `fk_venues_has_equipments_equipments1`
    FOREIGN KEY (`equipment_id`)
    REFERENCES `feshow`.`equipments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_venues_has_equipments_venues1`
    FOREIGN KEY (`venue_id`)
    REFERENCES `feshow`.`venues` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`genre_venues`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`genre_venues` (
  `venue_id` INT(11) NOT NULL,
  `genre_id` INT(11) NOT NULL,
  PRIMARY KEY (`venue_id`, `genre_id`),
  INDEX `fk_venues_has_genres_genres1_idx` (`genre_id` ASC),
  INDEX `fk_venues_has_genres_venues1_idx` (`venue_id` ASC),
  CONSTRAINT `fk_venues_has_genres_genres1`
    FOREIGN KEY (`genre_id`)
    REFERENCES `feshow`.`genres` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_venues_has_genres_venues1`
    FOREIGN KEY (`venue_id`)
    REFERENCES `feshow`.`venues` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`notifications` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(45) NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_notifications_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_notifications_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `feshow`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`producers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`producers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `description` VARCHAR(255) NULL,
  `chat_permission` TINYINT(1) NOT NULL DEFAULT 0,
  `city` VARCHAR(50) NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_producers_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_producers_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `feshow`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`solicitations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`solicitations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `venue_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `date` DATE NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_solicitations_venues1_idx` (`venue_id` ASC),
  INDEX `fk_solicitations_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_solicitations_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `feshow`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitations_venues1`
    FOREIGN KEY (`venue_id`)
    REFERENCES `feshow`.`venues` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`chat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sender` INT(11) NOT NULL,
  `receiver` INT(11) NOT NULL,
  `message` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_chat_users1_idx` (`sender` ASC),
  INDEX `fk_chat_users2_idx` (`receiver` ASC),
  CONSTRAINT `fk_chat_users1`
    FOREIGN KEY (`sender`)
    REFERENCES `feshow`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chat_users2`
    FOREIGN KEY (`receiver`)
    REFERENCES `feshow`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `feshow`.`notices`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`notices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `venue_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_posts_venues1_idx` (`venue_id` ASC),
  CONSTRAINT `fk_posts_venues1`
    FOREIGN KEY (`venue_id`)
    REFERENCES `feshow`.`venues` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `feshow`.`riders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`riders` (
  `artist_id` INT(11) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`artist_id`),
  CONSTRAINT `fk_riders_artists1`
    FOREIGN KEY (`artist_id`)
    REFERENCES `feshow`.`artists` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `feshow`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `feshow`.`posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `post` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  INDEX `fk_table1_events1_idx` (`event_id` ASC),
  PRIMARY KEY (`id`),
  INDEX `fk_table1_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_table1_events1`
    FOREIGN KEY (`event_id`)
    REFERENCES `feshow`.`events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_table1_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `feshow`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
