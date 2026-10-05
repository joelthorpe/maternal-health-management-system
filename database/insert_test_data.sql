USE CSC1034_2526_039; -- Ensure this is pointed towards the correct DB name

-- // CLEARS EXISTING DATA //
DELETE FROM tblPatient_RiskFactors;
DELETE FROM tblAppointment;
DELETE FROM tblPatient;
DELETE FROM tblStaff;
DELETE FROM tblClinic;
DELETE FROM tblRole;
DELETE FROM tblRiskFactors;
DELETE FROM tblAppointment_Status;
DELETE FROM tblRegion;


-- // Region Table //
-- Source: https://data.unicef.org/regionalclassifications/
INSERT INTO tblRegion (RegionID, RegionName) VALUES
('RG001', 'East Africa'),
('RG002', 'Southern Africa'),
('RG003', 'West Africa'),
('RG004', 'Central Africa');


-- // Appointment Status Table //
INSERT INTO tblAppointment_Status (StatusID, StatusName) VALUES
('ST001', 'Scheduled'),
('ST002', 'Completed'),
('ST003', 'Cancelled');


-- // Risk Factors Table // 
-- Source: Initial Design Specification + https://www.who.int/news-room/fact-sheets/detail/maternal-mortality
INSERT INTO tblRiskFactors (RiskID, RiskName, RiskDescription) VALUES
('RF001', 'Haemorrhage', 'Severe bleeding during or after childbirth'),
('RF002', 'Sepsis', 'Life-threatening infection occurring during pregnancy or after delivery'),
('RF003', 'Eclampsia', 'Severe complication of pre-eclampsia causing seizures during pregnancy');


-- // Role Table //
-- Source: https://www.who.int/health-topics/health-workforce
INSERT INTO tblRole (RoleID, RoleName) VALUES
('RL001', 'Midwife'),
('RL002', 'Nurse'),
('RL003', 'Doctor'),
('RL004', 'Community Health Worker');

-- // Clinic Table //
INSERT INTO tblClinic (ClinicID, RegionID, ClinicName, ClinicCapacity) VALUES
('C001', 'RG001', 'Tamale Community Health Post', 25), -- Ghana +233 (https://fakenumber.org/countries/ghana)
('C002', 'RG001', 'Kibera Health Centre', 60), -- Kenya +254 (https://fakenumber.org/countries/kenya)
('C003', 'RG002', 'Bulawayo District Hospital', 120), -- Zimbabwe +263 (https://fakenumber.org/countries/zimbabwe)
('C004', 'RG003', 'Kisongo Health Centre', 50), -- Tanzania +255 (https://fakenumber.org/countries/tanzania)
('C005', 'RG003', 'Mbare District Clinic', 80), -- Zimbabwe +263 (https://fakenumber.org/countries/zimbabwe)
('C006', 'RG004', 'Kano Rural Health Centre', 40), -- Nigeria +234 (https://fakenumber.org/countries/nigeria)
('C007', 'RG003', 'Maternal Center of Excellence', 70); -- 


-- // Staff Table //
-- Source: Data Dictionary alongside email and phone number generators.
-- Staff names were generated using this website: https://mythopedia.com/name-generator/african-names/
INSERT INTO tblStaff (StaffID, ClinicID, RoleID, StaffForename, StaffSurname, StaffDOB, StaffEmail, StaffPhoneNo) VALUES
-- // C001 (Tamale Community Health Post) [ghs.org.gh / moh.gov.gh] //
('S001', 'C001', 'RL001', 'Babaranwan', 'Mwanjirau', '1991-06-18', 'babaranwan.mwanjirau@ghs.org.gh', '+233910427047'),
('S002', 'C001', 'RL002', 'John', 'Smith', '1999-11-27', 'john.smith@moh.gov.ghm', '+233253078287'),
('S003', 'C001', 'RL003', 'Suhurhalam', 'Wamboge', '1979-02-09', 'suhurhalam.wamboge@ghs.org.gh', '+233157643017'),
-- // C002 (Kibera Health Centre) [health.go.ke / nairobi.go.ke] //
('S004', 'C002', 'RL001', 'Mabila', 'Kasyokabe', '1993-05-14', 'mabila.kasyokabe@health.go.ke', '+254822999947'),
('S005', 'C002', 'RL002', 'Adilahir', 'Kabelenoke', '1998-08-21', 'adilahir.kabelenoke@nairobi.go.ke', '+254377937011'),
('S006', 'C002', 'RL003', 'Assaila', 'Mbokeiha', '1977-11-02', 'assaila.mbokeiha@health.go.ke', '+254346528993'),
-- // C003 (Bulawayo District Hospital) [mohcc.gov.zw] //
('S007', 'C003', 'RL001', 'Karinari', 'Kabete', '1988-10-10', 'karinari.kabete@mohcc.gov.zw', '+263784816372'),
('S008', 'C003', 'RL002', 'Azirania', 'Karia', '1995-12-19', 'azirania.karia@mohcc.gov.zw', '+263789212708'),
('S009', 'C003', 'RL003', 'Mamba', 'Kamburuna', '1981-07-07', 'mamba.kamburuna@mohcc.gov.zw', '+263782513977'),
-- // C004 (Kisongo Health Centre) [afya.go.tz] //
('S010', 'C004', 'RL001', 'Rukazi', 'Nyambo', '1983-04-12', 'rukazi.nyambo@afya.go.tz', '+255232604342'),
('S011', 'C004', 'RL002', 'Mariz', 'Njiriani', '1987-09-23', 'mariz.njiriani@afya.go.tz', '+255222134969'),
('S012', 'C004', 'RL003', 'Idina', 'Kanyambo', '1974-01-15', 'idina.kanyambo@afya.go.tz', '+255272509754'),
-- // C005 (Mbare District Clinic) [mohcc.gov.zw] //
('S013', 'C005', 'RL001', 'Hadhat', 'Muyugu', '1984-07-30', 'hadhat.muyugu@mohcc.gov.zw', '+263784979851'),
('S014', 'C005', 'RL002', 'Zubarim', 'Gathatheru', '1988-03-11', 'zubarim.gathatheru@mohcc.gov.zw', '+263786372970'),
('S015', 'C005', 'RL003', 'Abdirajuma', 'Nziokasudi', '1984-12-05', 'abdirajuma.nziokasudi@mohcc.gov.zw', '+263785284552'),
-- // C006 (Kano Rural Health Centre) [health.gov.ng] //
('S016', 'C006', 'RL001', 'Rukriaheri', 'Gatho', '1982-01-09', 'rukriaheri.gatho@health.gov.ng', '+2344246489312'),
('S017', 'C006', 'RL002', 'Mary', 'Jones', '1990-06-17', 'mary.jones@health.gov.ng', '+2341084339978'),
('S018', 'C006', 'RL003', 'Shatifariq', 'Kamwamachi', '1975-03-28', 'shatifariq.kamwamachi@health.gov.ng', '+2341533168774'),
-- // For SQL Queries //
('S019', 'C004', 'RL001', 'Jonjo', 'Shelvey', '1998-05-02', 'jonjo.shelvey@mohcc.gov.zw', '+263785284526'),
('S020', 'C006', 'RL001', 'Alanga', 'Mobogo', '1995-04-06', 'alanga.mobogo@health.go.ke', '+25437468292'),
('S021', 'C001', 'RL001', 'Mary', 'Joseph', '1990-01-05', 'mary.joseph@nairobi.go.ke', '+233592014223');


-- // Patient Table // 
-- Source: Data Dictionary alongside phone number generators.
-- Patient names were generated using this website: https://mythopedia.com/name-generator/african-names/
-- Email Domains used: gmail.com yahoo.com outlook.com hotmail.com -> created using firstname.surname@domain.com
INSERT INTO tblPatient (PatientID, PatientForename, PatientSurname, ClinicID, PatientDOB, PatientVillage, PatientEmail, PatientPhoneNo, PatientPreviousBirths, PatientNoOfPregnancies) VALUES
-- // C001 (Tamale Community Health Post) //
('P001', 'Zarwajuma', 'Kianamba', 'C001', '1993-06-11', 'Tamale', 'zarwajuma.kianamba@outlook.com', '+233910427047', 5, 6),
('P002', 'Asrasima', 'Oketchirui', 'C001', '1991-02-28', 'Tamale', 'asrasima.oketchirui@yahoo.com', '+233253078287', 3, 3),
('P003', 'Afiyana', 'Nguanji', 'C001', '1998-10-09', 'Tamale', 'afiyana.nguanji@gmail.com', '+233157643017', 4, 4),
('P004', 'Khakiana', 'Mukaria', 'C001', '1997-05-15', 'Tamale', 'khakiana.mukaria@hotmail.com', '+233990644108', 2, 2),
-- // C002 (Kibera Health Centre) //
('P005', 'Amira', 'Waira', 'C002', '2004-07-30', 'Kibera', 'amira.waira@hotmail.com', '+254748665287', 2, 3),
('P006', 'Karam', 'Mambo', 'C002', '1993-02-10', 'Kibera', 'karam.mambo@gmail.com', '+254175831297', 0, 1),
('P007', 'Farifa', 'Keiambe', 'C002', '2001-05-22', 'Kibera', 'farifa.keiambe@yahoo.com', '+254979586279', 4, 4),
('P008', 'Fatmaltuna', 'Wachonguto', 'C002', '1997-10-15', 'Kibera', 'fatmaltuna.wachonguto@hotmail.com', '+254393155117', 1, 3),
('P009', 'Aminasha', 'Muiruibe', 'C002', '1998-03-08', 'Kibera', 'aminasha.muiruibe@outlook.com', '+254576681883', 4, 5),
('P010', 'Mwarayadia', 'Muguthieno', 'C002', '1994-11-25', 'Kibera', 'mwarayadia.muguthieno@yahoo.com', '+254415979730', 1, 1),
-- // C003 (Bulawayo District Hospital) //
('P011', 'Raima', 'Ngerono', 'C003', '2002-08-21', 'Bulawayo East', 'raima.ngerono@gmail.com', '+263786659416', 1, 1),
('P012', 'Tamaima', 'Kyago', 'C003', '1998-11-03', 'Bulawayo East', 'tamaima.kyago@hotmail.com', '+263782730264', 2, 2),
('P013', 'Talibar', 'Kitau', 'C003', '1992-04-26', 'Bulawayo East', 'talibar.kitau@yahoo.com', '+263782768855', 3, 4),
-- // C004 (Kisongo Health Centre) //
('P014', 'Najuma', 'Kipogeteru', 'C004', '1997-03-25', 'Kisongo', 'najuma.kipogeteru@gmail.com', '+255756065050', 4, 5),
('P015', 'Zarakia', 'Nyagainyo', 'C004', '1994-09-12', 'Kisongo', 'zarakia.nyagainyo@outlook.com', '+255756219308', 2, 2),
('P016', 'Mayya', 'Kavina', 'C004', '1998-07-04', 'Kisongo', 'mayya.kavina@hotmail.com', '+255753471741', 3, 3),
('P017', 'Nalimana', 'Gitaui', 'C004', '2000-12-18', 'Kisongo', 'nalimana.gitaui@yahoo.com', '+255753409957', 1, 3),
-- // C005 (Mbare District Clinic) //
('P018', 'Najumaha', 'Nguinaiga', 'C005', '2001-11-22', 'Mbare', 'najumaha.nguinaiga@gmail.com', '+263784979851', 4, 4),
('P019', 'Hairaya', 'Karago', 'C005', '1999-12-05', 'Mbare', 'hairaya.karago@yahoo.com', '+263786372970', 2, 2),
('P020', 'Tahraida', 'Muthari', 'C005', '2002-06-14', 'Mbare', 'tahraida.muthari@yahoo.com', '+263785284552', 2, 4),
('P021', 'Iqaysaina', 'Adhiendu', 'C005', '1993-01-19', 'Mbare', 'iqaysaina.adhiendu@hotmail.com', '+263784816372', 2, 3),
('P022', 'Duniahira', 'Wakhoha', 'C005', '1991-08-30', 'Mbare', 'duniahira.wakhoha@outlook.com', '+263789212708', 4, 5),
('P023', 'Thira', 'Wanjikana', 'C005', '2003-04-11', 'Mbare', 'thira.wanjikana@gmail.com', '+263782513977', 4, 7),
-- // C006 (Kano Rural Health Centre) NOTE: Made a high loss region on purpose //
('P024', 'Amaria', 'Mwathogei', 'C006', '1990-05-14', 'Kano Rural', 'amaria.mwathogei@outlook.com', '+2342742628085', 1, 3), 
('P025', 'Radhira', 'Gikakibi', 'C006', '2003-09-18', 'Kano Rural', 'radhira.gikakibi@yahoo.com', '+2349712706467', 2, 6), 
('P026', 'Qudsiha', 'Gitoo', 'C006', '1995-01-09', 'Kano Rural', 'qudsiha.gitoo@yahoo.com', '+2344624064167', 3, 5),
('P027', 'Riafiqba', 'Mboni', 'C006', '1992-11-20', 'Kano Rural', 'riafiqba.mboni@gmail.com', '+2344147342452', 2, 4),
('P028', 'Rasmaharwa', 'Maweyani', 'C006', '2005-04-12', 'Kano Rural', 'rasmaharwa.maweyani@outlook.com', '+2346142820009', 3, 6),
('P029', 'Qudsiya', 'Kungathele', 'C006', '1994-08-05', 'Kano Rural', 'qudsiya.kungathele@hotmail.com', '+2346543964390', 2, 4),
('P030', 'Ainaina', 'Ngitiru', 'C006', '1997-12-30', 'Kano Rural', 'ainaina.ngitiru@yahoo.com', '+234876423852', 1, 5),
-- // FOR SQL REPORTS //
('P031', 'Lina', 'Kamara', 'C006', '1996-04-12', 'Freetown', 'lina.kamara@gmail.com', '+232780800001', 2, 3),
('P032', 'Sara', 'Abebe', 'C006', '1992-08-21', 'Addis', 'sara.abebe@gmail.com', '+251900012102', 1, 2),
('P033', 'Nadia', 'Hassan', 'C005', '1989-02-14', 'Khartoum', 'nadia.hassan@yahoo.com', '+249185440003', 3, 4),
('P034', 'Joy', 'Okeke', 'C003', '2000-06-10', 'Enugu', 'joy.okeke@gmail.com', '+234800215604', 1, 1),
('P035', 'Mariam', 'Diallo', 'C004', '1997-09-03', 'Bamako', 'mariam.diallo@gmail.com', '+223700027485', 1, 2),
('P036', 'Aisha', 'Sule', 'C002', '1994-01-19', 'Kano', 'aisha.sule@hotmail.com', '+234805920006', 2, 3),
('P037', 'Zara', 'Ali', 'C007', '1998-12-12', 'Kaido', 'zara.ali@gmail.com', '+920085202071', 1, 1),
('P038', 'Anna', 'Madely', 'C006', '1995-12-03', 'Kaido', 'anna.madely@hitmail.com', '+232780817211', 1, 1),
('P039', 'Margaret', 'Keiambe', 'C006', '2000-01-12', 'Kano', 'margaret.keiambe@gmail.com', '+254179210017', 1, 1);


-- // Appointment Table //
-- Source: https://www.who.int/publications/i/item/9789241549912
-- NOTE: Patient data was excluded from here to make reports meaningful (fulfil patients with 0 appointments - P002, P027, P029, P030)
-- Reasons: Blood pressure and temperature reading, Ultrasound scan results, Medical History - Diabetic, HIV Testing, Blood Results, Height and Weight review, Initial Visit, Fetal Movement, Mental Health - Psychatric Illness, Medical History - Epileptic, Lie-Presentation, Medical History - Ashmatic, Screening, Routine check, Follow-up, High-risk review.

INSERT INTO tblAppointment (AppointmentID, StaffID, PatientID, AppointmentDateTime, AppointmentNotes, StatusID) VALUES
-- // C001 (Tamale Community Health Post) Appointments //
('A001', 'S001', 'P001', '2026-01-01 12:00:00', 'Blood pressure and temperature reading', 'ST003'),
('A002', 'S002', 'P003', '2026-01-02 13:00:00', 'Ultrasound scan results', 'ST002'),
('A003', 'S003', 'P004', '2026-01-07 10:00:00', 'Medical History - Diabetic', 'ST002'),
-- // C002 (Kibera Health Centre) Appointments //
('A004', 'S004', 'P005', '2026-06-14 11:00:00', 'HIV Testing', 'ST001'),
('A005', 'S005', 'P006', '2026-01-17 09:00:00', 'Blood Results', 'ST002'),
('A006', 'S006', 'P007', '2026-06-06 12:00:00', 'Blood pressure and temperature reading', 'ST001'),
('A007', 'S004', 'P008', '2026-01-25 10:00:00', 'Ultrasound scan results', 'ST002'),
('A008', 'S005', 'P009', '2026-02-08 15:00:00', 'Height and Weight review', 'ST002'),
('A009', 'S006', 'P010', '2026-02-09 09:00:00', 'Initial Visit', 'ST002'),
-- // C003 (Bulawayo District Hospital) Appointments //
('A010', 'S007', 'P011', '2026-01-14 10:00:00', 'HIV Testing', 'ST001'),
('A011', 'S008', 'P012', '2026-02-19 10:00:00', 'Fetal Movement', 'ST002'),
('A012', 'S009', 'P013', '2026-02-20 14:00:00', 'Mental Health - Psychatric Illness', 'ST002'),
-- // C004 (Kisongo Health Centre) Appointments //
('A013', 'S010', 'P014', '2026-02-22 10:00:00', 'Medical History - Epileptic', 'ST002'),
('A014', 'S011', 'P015', '2026-02-25 08:00:00', 'Ultrasound scan results', 'ST002'),
('A015', 'S012', 'P016', '2026-07-15 11:00:00', 'Lie-Presentation', 'ST001'),
('A016', 'S010', 'P017', '2026-03-31 13:00:00', 'Blood results', 'ST002'),
-- // C005 (Mbare District Clinic) Appointments  //
('A017', 'S013', 'P018', '2026-03-03 11:00:00', 'Height and Weight review', 'ST002'),
('A018', 'S014', 'P019', '2026-03-18 13:00:00', 'Fetal Movement', 'ST002'),
('A019', 'S015', 'P020', '2026-07-19 10:00:00', 'Medical History - Asthmatic', 'ST001'),
('A020', 'S013', 'P021', '2026-03-20 15:00:00', 'Blood pressure and temperature reading', 'ST002'),
('A021', 'S014', 'P022', '2026-03-25 14:00:00', 'Screening', 'ST002'),
('A022', 'S015', 'P023', '2026-04-03 15:00:00', 'Initial Visit', 'ST002'),
-- // C006 (Kano Rural Health Centre) Appointments NOTE: Alongside being high-loss, also one with the most missing appointments. //
('A023', 'S016', 'P024', '2026-08-23 14:00:00', 'Fetal Movement', 'ST001'),
('A024', 'S017', 'P025', '2026-04-04 11:00:00', 'Lie-Presentation', 'ST002'),
('A025', 'S018', 'P026', '2026-02-25 15:00:00', 'Blood results', 'ST002'),
('A027', 'S016', 'P028', '2026-04-07 12:00:00', 'Mental Health - Psychatric Illness', 'ST002'),
-- // FOR SQL REPORTS //
('A028', 'S014', 'P015', '2025-12-15 13:00:00', 'Screening', 'ST002'),
('A029', 'S001', 'P031', '2026-02-10 12:00:00', 'Routine check', 'ST002'),
('A030', 'S001', 'P032', '2026-02-12 10:00:00', 'Follow-up', 'ST002'),
('A031', 'S001', 'P033', '2026-02-15 11:00:00', 'High-risk review', 'ST002'),
('A032', 'S004', 'P034', '2026-03-01 09:00:00', 'Initial visit', 'ST002'),
('A033', 'S004', 'P035', '2026-03-03 12:00:00', 'Routine check', 'ST002'),
('A034', 'S007', 'P036', '2026-03-10 10:00:00', 'Blood pressure monitoring', 'ST001'),
('A035', 'S001', 'P001', '2026-04-05 15:00:00', 'Routine check', 'ST002'),
('A036', 'S001', 'P002', '2026-04-07 14:00:00', 'Follow-up', 'ST002'),
('A037', 'S001', 'P003', '2026-04-10 09:00:00', 'High-risk review', 'ST002'),
('A038', 'S010', 'P004', '2026-04-12 13:00:00', 'Routine check', 'ST003');


-- // Patient Risk Factors //
-- Source: https://www.who.int/news-room/fact-sheets/detail/maternal-mortality
INSERT INTO tblPatient_RiskFactors (PatientRiskID, PatientID, RiskID, RiskSeverity, DateIdentified, IsTreated) VALUES
('PR001', 'P003', 'RF001', 9, '2026-01-02', 0), 
('PR002', 'P005', 'RF002', 6, '2026-01-04', 1),
('PR003', 'P008', 'RF001', 5, '2026-01-07', 1),
('PR004', 'P007', 'RF003', 8, '2026-01-08', 0),
('PR005', 'P009', 'RF003', 9, '2026-01-09', 0),
('PR006', 'P011', 'RF001', 4, '2026-01-10', 1),
('PR007', 'P012', 'RF002', 7, '2026-01-11', 1),
('PR008', 'P014', 'RF001', 7, '2026-01-13', 1),
('PR009', 'P016', 'RF002', 9, '2026-01-15', 0),
('PR010', 'P018', 'RF003', 5, '2026-01-17', 1),
('PR011', 'P020', 'RF001', 10, '2026-01-19', 0),
('PR012', 'P023', 'RF002', 8, '2026-01-22', 1),
('PR013', 'P024', 'RF003', 6, '2026-01-23', 0),
('PR014', 'P025', 'RF003', 7, '2026-01-24', 0),
('PR015', 'P026', 'RF001', 8, '2026-01-25', 1), -- Only success in C006
-- // Patients that have multiple Risk Factors //
('PR016', 'P014', 'RF001', 3, '2026-02-02', 1),
('PR017', 'P018', 'RF003', 5, '2026-02-07', 1),
('PR018', 'P023', 'RF002', 8, '2026-02-11', 0),
('PR019', 'P024', 'RF003', 4, '2026-02-04', 0),
-- // For SQL Queries //
('PR020', 'P015', 'RF002', 8, '2026-02-14', 0),
('PR021', 'P008', 'RF003', 9, '2026-02-20', 0),
('PR022', 'P030', 'RF001', 10, '2026-03-15', 0),
('PR023', 'P029', 'RF002', 8, '2026-03-25', 0),
('PR024', 'P031', 'RF001', 9, '2026-02-01', 0),
('PR025', 'P031', 'RF002', 8, '2026-02-02', 0),
('PR026', 'P032', 'RF003', 9, '2026-02-03', 0),
('PR027', 'P032', 'RF001', 8, '2026-02-04', 0),
('PR028', 'P033', 'RF002', 7, '2026-02-05', 0),
('PR029', 'P033', 'RF003', 8, '2026-02-06', 0),
('PR030', 'P033', 'RF001', 9, '2026-02-07', 0),
('PR031', 'P035', 'RF002', 7, '2026-02-08', 0),
('PR032', 'P036', 'RF003', 8, '2026-02-09', 0),
('PR033', 'P025', 'RF002', 9, '2026-03-12', 1),
('PR034', 'P026', 'RF003', 8, '2026-04-10', 0),
('PR035', 'P027', 'RF001', 10, '2026-03-03', 0),
('PR036', 'P028', 'RF002', 8, '2026-01-15', 0),
('PR037', 'P030', 'RF001', 9, '2026-04-03', 0),
('PR038', 'P032', 'RF002', 9, '2026-03-20', 0),
('PR039', 'P038', 'RF001', 7, '2026-01-12', 0),
('PR040', 'P039', 'RF003', 7, '2026-04-03', 0);