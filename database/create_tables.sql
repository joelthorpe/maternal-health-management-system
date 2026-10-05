-- Selects the database that is being used
USE CSC1034_2526_039; -- name of database

-- Drop tables if they already exist (child first)
-- just done the reverse of the order they were implemented
DROP TABLE IF EXISTS tblPatient_RiskFactors;
DROP TABLE IF EXISTS tblAppointment;
DROP TABLE IF EXISTS tblStaff;
DROP TABLE IF EXISTS tblPatient;
DROP TABLE IF EXISTS tblClinic;
DROP TABLE IF EXISTS tblRole;
DROP TABLE IF EXISTS tblRiskFactors;
DROP TABLE IF EXISTS tblAppointment_Status;
DROP TABLE IF EXISTS tblRegion;

-- /////// Table Creation ///////

-- // Region Table // 
CREATE TABLE tblRegion (
    RegionID VARCHAR(5) NOT NULL PRIMARY KEY,
    RegionName VARCHAR(100) NOT NULL UNIQUE
);

-- // Appointment Status Table // 
CREATE TABLE tblAppointment_Status (
    StatusID VARCHAR(5) NOT NULL PRIMARY KEY,
    StatusName VARCHAR(50) NOT NULL UNIQUE
);

-- // Risk Factors Table // 
CREATE TABLE tblRiskFactors (
    RiskID VARCHAR(5) NOT NULL PRIMARY KEY,
    RiskName VARCHAR(100) NOT NULL UNIQUE,
    RiskDescription VARCHAR(150) NOT NULL
);

-- // Role Table // 
CREATE TABLE tblRole (
    RoleID VARCHAR(5) NOT NULL PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE
);

-- // Clinic Table // 
CREATE TABLE tblClinic (
    ClinicID VARCHAR(4) NOT NULL PRIMARY KEY,
    RegionID VARCHAR(5) NOT NULL,
    ClinicName VARCHAR(150) NOT NULL UNIQUE,
    ClinicCapacity INT NOT NULL CHECK(ClinicCapacity > 0 AND ClinicCapacity <= 150),
    FOREIGN KEY (RegionID) REFERENCES tblRegion(RegionID)
);

-- // Staff Table // 
CREATE TABLE tblStaff (
    StaffID VARCHAR(4) NOT NULL PRIMARY KEY,
    ClinicID VARCHAR(4) NOT NULL,
    RoleID VARCHAR(5) NOT NULL,
    StaffForename VARCHAR(100) NOT NULL,
    StaffSurname VARCHAR(150) NOT NULL,
    StaffDOB DATE NOT NULL, -- validation is done on the website
    StaffEmail VARCHAR(150) NOT NULL UNIQUE CHECK(StaffEmail LIKE '%@%.%'),
    StaffPhoneNo VARCHAR(15) NOT NULL UNIQUE CHECK(StaffPhoneNo REGEXP '^\\+[0-9]+$'),
    FOREIGN KEY (ClinicID) REFERENCES tblClinic(ClinicID),
    FOREIGN KEY (RoleID) REFERENCES tblRole(RoleID)
);

-- // Patient Table // 
CREATE TABLE tblPatient (
    PatientID VARCHAR(4) NOT NULL PRIMARY KEY, 
    PatientForename VARCHAR(100) NOT NULL,
    PatientSurname VARCHAR(150) NOT NULL,
    ClinicID VARCHAR(4) NOT NULL,
    PatientDOB DATE NOT NULL, -- validation is done on the website
    PatientVillage VARCHAR(100) NOT NULL,
    PatientEmail VARCHAR(150) NOT NULL UNIQUE CHECK(PatientEmail LIKE '%@%.%'),
    PatientPhoneNo VARCHAR(15) NOT NULL UNIQUE CHECK(PatientPhoneNo REGEXP '^\\+[0-9]+$'),
    PatientPreviousBirths INT NOT NULL DEFAULT 0 CHECK(PatientPreviousBirths >= 0),
    PatientNoOfPregnancies INT NOT NULL DEFAULT 0 CHECK(PatientNoOfPregnancies >= 0),
    FOREIGN KEY (ClinicID) REFERENCES tblClinic(ClinicID)
);

-- // Appointment Table // 
CREATE TABLE tblAppointment (
    AppointmentID VARCHAR(4) NOT NULL PRIMARY KEY, 
    StaffID VARCHAR(4) NOT NULL,
    PatientID VARCHAR(4) NOT NULL,
    AppointmentDateTime DATETIME NOT NULL, -- validation is done on the website
    AppointmentNotes VARCHAR(500) NOT NULL,
    StatusID VARCHAR(5) NOT NULL,
    UNIQUE (StaffID, AppointmentDateTime), -- prevent double booking (https://www.datacamp.com/doc/mysql/mysql-unique)
    UNIQUE (PatientID, AppointmentDateTime), -- prevent double booking
    FOREIGN KEY (StaffID) REFERENCES tblStaff(StaffID),
    FOREIGN KEY (PatientID) REFERENCES tblPatient(PatientID),
    FOREIGN KEY (StatusID) REFERENCES tblAppointment_Status(StatusID)
);

-- // Patient Risk Factors Table // 
CREATE TABLE  tblPatient_RiskFactors (
    PatientRiskID VARCHAR(5) NOT NULL PRIMARY KEY,
    PatientID VARCHAR(4) NOT NULL,
    RiskID VARCHAR(5) NOT NULL,
    RiskSeverity INT NOT NULL CHECK(RiskSeverity BETWEEN 1 AND 10 ) ,
    DateIdentified DATE NOT NULL, -- validation is done on the website
    IsTreated TINYINT(1) NOT NULL DEFAULT 0 CHECK(IsTreated IN (0, 1)),
    UNIQUE (PatientID, RiskID, DateIdentified), -- avoids adding same patient to same risk id in the same appointment
    FOREIGN KEY (PatientID) REFERENCES tblPatient(PatientID),
    FOREIGN KEY (RiskID) REFERENCES tblRiskFactors(RiskID)
);

-- /////// Indexes ///////
-- Indexes below have been added for use on the report pages (if not already utilising a primary/foreign key)
CREATE INDEX idx_patient_village ON tblPatient(PatientVillage);
CREATE INDEX idx_risk_severity ON tblPatient_RiskFactors(RiskSeverity);