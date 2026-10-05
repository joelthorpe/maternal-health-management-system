# Maternal Health Management System

A full-stack, database-driven web application built to support safer pregnancies and coordinated care. This project was developed as a 1st year Data-Driven Systems group project (in a team of 5) to demonstrate relational database design, front-end development, and system architecture principles.

## Features
* **Clinic Administration:** Manage clinics and staff through a dedicated admin dashboard.
* **Midwife Management:** Provide midwives with tools to manage patients, appointments, and patient risk factors.
* **Data Reporting:** Access interactive and responsive data reports (5+ specialized reports) to track key maternal health metrics.
* **Database Querying:** Utilize scripted relational database schema and test datasets in SQL for back-end data persistence.
* **Interactive UI:** Interactive JavaScript features and styled HTML/CSS pages for a smooth user experience.
* **Live Deployment:** System is fully deployed and accessible on the EEECS server.

## Concepts Demonstrated
* Full-Stack Web Development
* Relational Database Schema Design (SQL)
* Back-end Data Persistence and Querying
* Front-end Development (HTML, CSS, JavaScript)
* Responsive Design for Data Reports
* Database Documentation and Web Architecture Presentation
* NoSQL Database Model Evaluation

## My Contributions
* **Database Documentation:** Co-developed the final Data Dictionary and Entity-Relationship Diagram (ERD) to align with the implemented MySQL schema.
* **Database Schema:** Created the core database tables (clinics, staff, appointments, regions, risk factors, assigned risk factors, roles, patients), implemented Primary and Foreign Keys, and added indexes to optimise report query speeds.
* **Database Integrity:** Set up database constraints to prevent erroneous data, including range checks for risk severity and clinic capacity, format checks for emails and phones, boundary checks for patient pregnancy data, and restricted options for IsTreated values.
* **Database Test Data:** Generated and inserted realistic test data using resources like WHO and UNICEF data.
* **API Interaction & Client-Side Logic:** Collaborated on the JavaScript needed to dynamically fetch records, handle display messages, populate tables and dropdowns, retrieve the latest IDs, manage CRUD form submissions, and reset forms.
* **CRUD Functionality:** Built the complete UI, functionality, and client-side validation (validateRiskFactors and validatePatientRiskFactors) for managing "Risk Factors" and "Patient Risk Factors", which included handling many-to-many relationships and user confirmation alerts.
* **SQL & Web Reporting:** Wrote the SQL queries and developed the web interfaces (custom HTML, CSS, and JS) for three specific reports:
  * *Average Pregnancy Loss Rates by Village:* A tabular report featuring parameterised filtering via a dropdown menu and an INNER JOIN query.
  * *High-Risk Patients Lacking Active Appointments:* A tabular report with dynamic risk severity filtering powered by LEFT and INNER JOINs.
  * *Clinic Risk Treatment Success Rates:* A data visualisation using Chart.js to display treated versus untreated success rates, filterable by clinic name using a SQL VIEW.
* **System Navigation:** Implemented a dedicated report hub linking to my assigned tabular and visual reports, reusing the main website's theme for consistency.

## Project Structure
The application is separated into multiple HTML views for different users, alongside assets for styling and interactivity:

```text
/
├── 00-MainPage.html
├── 01-ClinicAdminDashboard.html
├── 04-ReportsDashboard.html
├── 05-MidwifeDashboard.html
├── css/
├── images/
└── js/
```
* **`00-MainPage.html`** - Handles the main entry point and navigation.
* **`01-ClinicAdminDashboard.html`** - Provides clinic management and staff administration functionality.
* **`05-MidwifeDashboard.html`** - Manages patients, appointments, and risk factors for midwives.
* **`04-ReportsDashboard.html`** - Displays various interactive data reports (including individual reports such as Joel's).
* **`css/` & `js/`** - Contains stylesheets for responsive design and scripts for interactive front-end features.

## Technologies Used
* HTML5 / CSS3
* JavaScript
* SQL (Relational Databases)
* Web Hosting / Server Deployment
* Git / GitHub

## How to Run
1. Access the live system directly at: [https://jthorpe01.webhosting1.eeecs.qub.ac.uk/00-MainPage.html](https://jthorpe01.webhosting1.eeecs.qub.ac.uk/00-MainPage.html)
2. Alternatively, clone this repository.
3. Open `00-MainPage.html` in a web browser to start the interactive web application locally.
