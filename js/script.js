/* Put your username in place of the web address to connect to the database
e.g. https://zouyang03.webhosting1.eeecs.qub.ac.uk/dbConnector.php
*/

// This Method will be the main method used to run queries 
const runQuery = async (sql) => {
    const url = "https://amckelvey06.webhosting1.eeecs.qub.ac.uk/dbConnector.php";

    try{

        // This sends the SQL query to the database
        const response = await fetch(url, {
            method: "POST",
            body: new URLSearchParams({
                query: sql
            })
        });

        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }


        // Converts the response to JSON format
        const result = await response.json();

        // Returns the message/data retrieved
        return result;
    }
    catch(error){
        console.log(error.message);
    }
} 

/* Displays the message on the actual page
- text: The message you want to display
- messageDiv: The div which will contain the message, usually the ones with the ID:actionResult
*/
const displayMessage = (text, messageDiv) => {
    messageDiv.textContent = "";
    messageDiv.textContent = text;
    messageDiv.style.display = "block";
    };

/* Fills a DIV with the data of a table
- divElement: The div html where you want the table to be
- SQL: The name of the table you are retrieving the data from
- fields: The name of the fields of the table
- messageDiv: The div where the response of the message is to be displayed
              It is usually below the Form and list of a table's data
- primaryKeyPrefix: The prefix of the ID used e.g. ClinicID C001
- formName: the HTML form element which is used to do a CRUD function
*/
const fillTable = async (divElement, SQLtableName, fields, messageDiv, primaryKeyPrefix, formName) =>{
    // Clears the HTML inside for refresh
    divElement.innerHTML = "";
    // tr is created for the first row
    let tblHeaders = document.createElement("tr");
    // The actual table which holds the data being created
    let HTMLtable = document.createElement("table");
    // The SQL thats going to be ran to get the data and from what table
    let sql = `SELECT * FROM ${SQLtableName}`;
    // Runs the sql query to return an array of data
    let result = await runQuery(sql);

    // Checks that the result is returned properly
    if (result && result.success && result.data.length > 0) {
        // The divElement is the div of the page where the table goes
        divElement.appendChild(HTMLtable);
        HTMLtable.appendChild(tblHeaders);

        // Creates the first row of headers which is based of the fields' name
        for(let field of fields){
            let heading = document.createElement("th");
            heading.textContent = field;
            tblHeaders.appendChild(heading);
        }

        // Extra Column Header for additional functionality such as deleting/editing data
        let actionHeading = document.createElement("th");
        actionHeading.textContent = "Actions";
        tblHeaders.appendChild(actionHeading);

        // if the result returns something and is successful the following code is ran
    
        // first for loop is used to create rows
        for(let data of result.data)
        {
            let newRow = document.createElement("tr");

            // This nested for loop is used to loop through an entity to get its attributes
            for(let key in data){
                let newCol = document.createElement("td");
                // the data[key] gets the other pair value e.g. ClinicID : "C001"
                newCol.textContent = data[key];
                //Appends each column to the current row
                newRow.appendChild(newCol);
            }

            // Creating an action column
            let actionColumn = document.createElement("td");

            //////////////////// FORM DELETE LOGIC ////////////////////

            // Creating the delete button and putting it in a tr then the row then the table
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.style = 'color:rgb(213, 69, 69);' // Makes the button text red

            // Adding Functionality to the button
            deleteBtn.addEventListener("click", async() =>{

                ////////////// FOREIGN KEY CONSTRAINT CHECKS /////////////
                // defining ALL the tables we have in the database that include foreign keys
                const checkTables = ["tblPatient_RiskFactors", "tblAppointment", "tblStaff"];

                // for loop check to check the tables
                for(let checkTable of checkTables)
                {
                    // Makes it so that it doesnt check the current table that we are currently viewing
                    if(checkTable != SQLtableName)
                    {
                        /*
                        fields[0] - The name of the ID such as "ClinicID"
                        data[fields[0]] - The value of the ID such as C001
                        */
                       console.log(`SELECT ${fields[0]} FROM ${checkTable} WHERE ${fields[0]} = "${data[fields[0]]}";`);
                        let checkSql = `SELECT ${fields[0]} FROM ${checkTable} WHERE ${fields[0]} = "${data[fields[0]]}";`;
                        let checkResult = await runQuery(checkSql);
                        // checks if data was returned with the specfic type of ID and value and also checks if there is actually data returned from that table
                        if(checkResult && checkResult.data && checkResult.data.length >= 1)
                        {

                            displayMessage(`Cannot delete ${data[fields[0]]} as it is present in ${checkTable}`, messageDiv);
                            return;
                        }
                        else
                        {
                            console.log("no data there");
                            // Checks if the error is because the field isnt in the table, could be improved 
                            if(checkResult.error == `Error: Unknown column '${fields[0]}' in 'SELECT'`)
                            {
                                // console.log("ID not present in table");
                            }
                            else
                            {
                                console.log(checkResult.error);
                            }
                        }

                    }
                    
                }



                // Creates a pop up at the top of the page to confirm the deletion of the clinic
                // The data[fields[0]] gets the ID of the entity since its the first item in the fields (or should be)
                const deletionConfirmation = confirm(`Delete ${data[fields[0]]} from ${SQLtableName}`);

                // Code to check if the user confirmed or not
                if(!deletionConfirmation)
                {
                    displayMessage(`${data[fields[0]]} has not been deleted from ${SQLtableName}`, messageDiv);
                    // This return stops the code here so it doesnt delete it from the table
                    return;
                }
                // Sets the deletion SQL
                let deleteSql = `DELETE FROM ${SQLtableName} WHERE ${fields[0]} = "${data[fields[0]]}";`;

                // Gets the result from the database
                let deleteResult = await runQuery(deleteSql);

                if(deleteResult && deleteResult.success)
                {
                    displayMessage(`Successfully deleted ${data[fields[0]]} from ${SQLtableName}`,messageDiv);
                    fillTable(divElement, SQLtableName, fields, messageDiv, primaryKeyPrefix, formName); // Refreshes the table
                    resetForm(formName, fields, SQLtableName, primaryKeyPrefix, messageDiv); // Refreshes the form
                }

                if(deleteResult && deleteResult.error)
                {
                    alert(deleteResult.error);
                }

            })

            //////////////////// FORM UPDATE LOGIC ////////////////////
            
            // Creating the UPDATE button and putting it in a tr then the row then the table
            let updateBtn = document.createElement("button");
            updateBtn.textContent = "Update";
            updateBtn.style = 'color:rgb(12, 133, 67);' // Makes the button text green

            // Adding Functionality to the button
            updateBtn.addEventListener("click", async() =>{
                // checks if there is only the save record button so it doesnt keep adding cancels
                if(document.getElementById("btnList").children.length == 1)
                {
                    // Creating a cancel button incase the user wants to cancel updating the specified field
                    let cancelBtn = document.createElement("button");
                    cancelBtn.textContent = "Cancel";
                    // Makes the cancel button appear beside the update button
                    document.getElementById("btnList").appendChild(cancelBtn);

                    // Cancel button functionality
                    cancelBtn.addEventListener("click", async() =>{
                        // Removes the cancel button from the list of buttons to make it 'disappear'
                        document.getElementById("btnList").removeChild(cancelBtn);
                        // Resets the form
                        resetForm(formName, fields, SQLtableName, primaryKeyPrefix, messageDiv, 0); // Refreshes the form with 0 delay
                    })
                }
                
                // Loops through all fields
                for (let field of fields) {
                    // Sets each forms input value to the corresponding data from the selected record
                    const input = document.getElementById(field);

                    if (input) {
                        input.value = data[field];
                    } else {
                        displayMessage(`Error - Input for "${field} not found`, messageDiv);
                    }
                }

                // Changes text on the button to read Update Record
                document.getElementById("btnSubmit").textContent = "Update Record";

                // Tell the user they are currently editing the data record - based on primary key value
                displayMessage(`Currently editing: ${data[fields[0]]}`, messageDiv);
            })

            // Adding the update button to the action column
            actionColumn.appendChild(updateBtn);
            // Adding the delete button to the action column
            actionColumn.appendChild(deleteBtn);

            // Adding the action column to the table
            newRow.appendChild(actionColumn);
            // puts the newly created row in the table
            HTMLtable.appendChild(newRow);
        }
    }
    else{
        let errMessage = document.createElement("p");
        errMessage.textContent = "No data available";
        divElement.appendChild(errMessage);
    }
    
}

/* createDropdownOptions is used to create dropdowns for fixed amount of option like for IDs
- htmlSelectElement: The HTML select block that will be filled with options
- field: The field that you want the options of e.g. ClinicID would show all the ClinicIDs currently available
- displayFields: Any additional fields to be displayed alongside the field, mainly used for Staff and Patient Forename + Surname
- tableName: The table which the field resides in

- Example Format: createDropdownOptions(document.getElementById("StaffID"), "StaffID", "tblStaff", ["StaffForename", "StaffSurname"]);
*/
const createDropdownOptions = async (htmlSelectElement, field, tableName, displayFields = null)=>{
    // Gets the relating name field for the table if it ends in ID
    if (!displayFields && field.endsWith("ID")) {
        // Ensures the fields are stored within an Array
        displayFields = [field.replace("ID", "Name")];
    // If no additional fields are provided and main field is not an ID, just use an empty array
    } else if (!displayFields) {
        displayFields = [];
    }

    // Joins the additional fields if more than 1 with the primary field
    const selectFields = [field, ...displayFields].join(", ");

    let sql = `SELECT ${selectFields} FROM ${tableName} ORDER BY ${field} ASC`
    const result = await runQuery(sql);

    if (!result || !result.data || result.data.length <= 0) {
        // If the data returned from the query being ran is invalid, stop
        return;
    }

    // Clears any existing HTML
    htmlSelectElement.innerHTML = "";

    // Creates the default option for the htmlSelectElement
    const defaultOption = document.createElement("option");
    // the actual value of the option
    defaultOption.value = "";
    // shows what the option displays
    defaultOption.textContent = `Select a ${field}`;
    // adds it to the select to be able to see that option
    htmlSelectElement.appendChild(defaultOption);

    // this loops through the data returned by the sql query
    // The data being the field selected returned as a list of objects
    for (let data of result.data) {
        // creates a html option
        let newOption = document.createElement("option");
        // gets the value of the field e.g. RegionID would be RG01
        newOption.value = data[field];

        // Combines multiple fields if needed (will just loop once and then remove trailing space if not needed)
        let displayText = "";
        for (const field of displayFields) {
            displayText += data[field] + " ";
        }
        displayText = displayText.trim(); // Removes the trailing space

        // If the variable displayText is not empty - meaning there are additional fields
        if(displayText) {
            // Populate dropdown with main field and descriptive fields
            newOption.textContent = `${data[field]} - ${displayText}`;
        } else {
            // Otherwise, just show the main field if it's already descriptive
            newOption.textContent = `${data[field]}`;
        }

        // adds the created option to the select html element
        htmlSelectElement.appendChild(newOption);
    }
}

/* Generates the latest ID 
- field: The name of the field to show
- tableName: The table which the field is in
- prefix: The prefix of a certain ID
- HTMLInputElement: The actual html input where the data will be shown
*/
const presentLatestID = async(HTMLInputElement,tableName, field, prefix) => {
    // Runs the query to get the latest ID
    const sql = `SELECT ${field} FROM ${tableName} ORDER BY ${field} DESC LIMIT 1`;
    const result = await runQuery(sql);

    let nextID = `${prefix}001`; // assigns to default value if empty

    // Checks if data was returned and has data
    if (result && result.data && result.data.length > 0) {
        //console.log(result);
        const lastID = result.data[0][field];

        // extracts number after the prefix and increments it
        const numPart = parseInt(lastID.substring(prefix.length));
        const nextNum = numPart + 1;

        // This code makes it so that the prefix starts with atleast three zeros
        nextID = prefix + nextNum.toString().padStart(3, '0');
    }

    // Displaying and setting the value of the ID 
    HTMLInputElement.value = nextID;
    HTMLInputElement.textContent = nextID;
};

/* Handles INSERTION of data into the tables and UPDATE record logic
- divElement: The div html where you want the table to be
- formName: The HTML form element to be handled
- fields: Array of field IDs (strings) that exist in the form
- tableName: The name of the database table inserting data into
- primaryKeyPrefix: Prefix for the primary key field
- validateFunc: Function to pass in that validates the form data
- messageDiv: Div that contains the element where messages are stored
*/
const handleFormSubmission = (divElement, formName, fields, tableName, primaryKeyPrefix, validateFunc, messageDiv) => {
    // Handles Form Submission
    formName.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevents page reload
        
        // Object to hold form data
        const formData = {};

        // Populates the formData with key:pair values
        for (let field of fields) {
            const value = formName.querySelector(`#${field}`).value.trim();
            formData[field] = value;
        }

        // Validation happens here - calls the function in script.js specified by the function call
        const validationMessage = await validateFunc(formData);
        if (validationMessage) {
            displayMessage(validationMessage, messageDiv);
            return;
        }

        // Extracts the key and pair values from the object
        const fieldNames = Object.keys(formData);
        const fieldValues = Object.values(formData);
        
        // Adds singular quotes around values that aren't numbers
        // Done to prevent errors when inserting into MySQL
        const formattedValues = [];
        // Iterates over all the values in the object
        for (let value of fieldValues) {
            // If the value is not a number or a phone number (special case)
            if (isNaN(value)  || (typeof value === "string" && value.startsWith("+"))) {
                // Add singular quotes around the value
                formattedValues.push("'" + value + "'");
            } else {
                // Else, just submit the value as is
                formattedValues.push(value);
            }
        }

        // Save Record Logic
        if (document.getElementById("btnSubmit").textContent.includes("Save")) {
            // Popup at the top of the page, asking the user if they wish to insert the record
            // data[fields[0]] refers to the Primary Key ID of the entity as its usually the first field
            const insertConfirmation = confirm(`Do you wish to insert record ${fieldValues[0]}`);

            // Code to check if the user confirmed or not
            if(!insertConfirmation)
            {
                displayMessage(`${fieldValues[0]} has not been inserted`, messageDiv);
                // Call the reset form function to clear the field values
                resetForm(formName, fields, tableName, primaryKeyPrefix, messageDiv);
                // This return stops the code here so it doesnt update the record
                return;
            }

            // Builds the SQL query and runs
            const sql = `INSERT INTO ${tableName} (${fieldNames.join(', ')}) VALUES (${formattedValues.join(', ')});`;
            const result = await runQuery(sql);

            // If the query is successful, tell the user
            if (result && result.success) {
                // Let the user know that the record was updated successfully
                displayMessage(`Record ${fieldValues[0]} was inserted successfully.`, messageDiv);
                
                // Call the reset form function to clear the field values
                resetForm(formName, fields, tableName, primaryKeyPrefix, messageDiv);
                // Refresh the table dynamically
                fillTable(divElement, tableName, fields, messageDiv, primaryKeyPrefix, formName);

                // This return stops the code here so it doesnt update the record
                return;
            } else {
                alert(result.error);
            }
        // Update Record Logic
        } else {
            // Pop up at the top of the page, asking the user if they wish to update the record
            // data[fields[0]] refers to the Primary Key ID of the entity as its usually the first field
            const updateConfirmation = confirm(`Do you wish to update record ${fieldValues[0]}`);

            // Code to check if the user confirmed or not
            if(!updateConfirmation)
            {
                // Tells the user that the field has not been updated
                displayMessage(`${fieldValues[0]} has not been updated`, messageDiv);
                // Call the reset field form
                resetForm(formName, fields, tableName, primaryKeyPrefix, messageDiv);

                // Removes the cancel button by checking if there are 2 items in the button list
                if (document.getElementById("btnList").children.length == 2) {
                    document.getElementById("btnList").removeChild(document.getElementById("btnList").children[1]);
                }

                // This return stops the code here so it doesnt update the record
                return;
            }

            // Combine field names and corresponding values into "field = value" pairs
            const valuePairs = [];
            for (let i = 0; i < fieldNames.length; i++) {
                valuePairs.push(`${fieldNames[i]} = ${formattedValues[i]}`)
            }

            // Builds the SQL query and runs
            const sql = `UPDATE ${tableName} SET ${valuePairs.join(', ')} WHERE ${fieldNames[0]} = ${formattedValues[0]};`;
            const result = await runQuery(sql);

            // If the query is successful, tell the user
            if (result && result.success) {
                // Let the user know that the record was updated successfully
                displayMessage(`Record ${fieldValues[0]} was updated successfully.`, messageDiv);

                // Call the reset field form
                resetForm(formName, fields, tableName, primaryKeyPrefix, messageDiv);
                // Refresh the table dynamically
                fillTable(divElement, tableName, fields, messageDiv, primaryKeyPrefix, formName);

                // Removes the cancel button by checking if there are 2 items in the button list
                if(document.getElementById("btnList").children.length == 2)
                {
                    document.getElementById("btnList").removeChild(document.getElementById("btnList").children[1]);
                }
                // This return stops the code here so it doesnt update the record
                return;
            } else {
                alert(result.error);
            }
        }
      
    });
}

/* Handles clearing the form of data, often used throughout INSERTION and UPDATE logic
- formName: The HTML form element to be handled
- fields: Array of field IDs (strings) that exist in the form
- tableName: The name of the database table inserting data into
- primaryKeyPrefix: Prefix for the primary key field
- messageDiv: Div that contains the element where messages are stored - not passing this means you don't want the messageDiv to clear
- delay: Controls the delay time of the message disappearing - not passing this means you want the default delay
*/
const resetForm = (formName, fields, tableName, primaryKeyPrefix, messageDiv = null, delay = 2000) => {
    // Reset form by clearing all field values
    for (let field of fields) {
        const input = formName.querySelector(`#${field}`);
        // If there is a input named field value
        if (input) {
            // Get the value of the input
            input.value = "";
        } else {
            // Else, tell the user something went wrong
            alert(`Invalid Field: ${field}`)
        }
    }

    // Generate the latest primary key ID for the form
    presentLatestID(document.getElementById(fields[0]), tableName, fields[0] , primaryKeyPrefix);

    // Changes text on the button to read "Save Record" (default text)
    document.getElementById("btnSubmit").textContent = "Save Record";

    if (messageDiv !== null) {
        // Makes the Pop up at the top disappear and clears content
        // Makes it wait on a timer before disappearing - https://www.w3schools.com/js/js_timing.asp
        setTimeout(() => {
            messageDiv.style.display = "none";
            messageDiv.textContent = "";
        }, delay); // Waits before clearing - uses parameter value 'delay'
    }

}


//////////////////////////////////// VALIDATION CODE ////////////////////////////////////

const validateClinic = (clinic) => {
    if (!clinic || typeof clinic !== "object") {
      return "Clinic details are required.";
    }

    const clinicID = clinic.ClinicID;
    const regionID = clinic.RegionID;
    const clinicName = typeof clinic.ClinicName === "string" ? clinic.ClinicName.trim() : "";
    const clinicCapacity = Number(clinic.ClinicCapacity);

    if (!Number.isInteger(clinicCapacity) || clinicCapacity < 1) {
      return "The Clinic capacity must be greater than 0";
    }

    if (clinicCapacity > 150) {
      return "Maximum clinic capacity is 150";
    }

    if (!clinicName) {
      return "Clinic name is required.";
    }

    if (clinicName.length > 150) {
      return "Clinic name must be 150 characters or fewer.";
    }

    return null;
  }


  const validateStaff = async (staff) => {
    if (!staff || typeof staff !== "object") {
      return "Staff details are required.";
    }

    const sql = `SELECT * FROM tblStaff WHERE StaffID !="${staff.StaffID}";`;
    const result = await runQuery(sql);

    if(result && result.data)
    {
      // console.log(result);
      /* No need to check as it will be forced to be corrected
      const staffID = staff.staffID;
      const clinicID = staff.clinicID;
      const roleID = staff.roleID;
      */

    const staffForename = typeof staff.StaffForename === "string" ? staff.StaffForename.trim() : "";
    const staffSurname = typeof staff.StaffSurname === "string" ? staff.StaffSurname.trim() : "";
    const staffPhoneNo = typeof staff.StaffPhoneNo === "string" ? staff.StaffPhoneNo.trim(): "";
    const staffEmail = typeof staff.StaffEmail === "string" ? staff.StaffEmail.trim() : "";
    const staffDOB = new Date(staff.StaffDOB);
    
    
    // Staff date of birth validation

    if (staffDOB >= new Date()) {
      return "Date of birth must be before today's date";
    }

    // Staff forename validation

    if (!staffForename) {
      return "Staff Forename is required.";
    }

    if (staffForename.length > 100) {
      return "Staff Forename must be 100 characters or fewer.";
    }


    // Staff surname validation

    if (!staffSurname) {
      return "Staff Surname is required.";
    }

    if (staffSurname.length > 150) {
      return "Staff Surname must be 150 characters or fewer.";
    }

    // Staff Email validation
    for(let data of result.data)
    {
      if(data.StaffEmail == staffEmail){
          return staffEmail + " already exists, staff email must be unique";
      }
      //console.log(staffEmail+ " " +data.StaffEmail + "\n");
    }

    // Staff Phone number validation

    for(let data of result.data)
    {
      if(data.StaffPhoneNo == staffPhoneNo){

          return staffPhoneNo + " already exists, phone number must be unique";
      }
      // console.log(staffPhoneNo + " " + data.StaffPhoneNo+ "\n");
    }

    return null;

    }
    else
    {
      return result.error;
    }

  }

const validateRiskFactors = (riskFactor) => {
    if (!riskFactor || typeof riskFactor !== "object") {
      return "Risk Factor details are required.";
    }

    const riskName = riskFactor.RiskName;
    const riskDescription = riskFactor.RiskDescription;

    //////////////// Risk Name Validation: ////////////////

    if (typeof riskName !== "string" || riskName.trim() === "") {
        return "Risk Name is required!";
    }

    // 1000 has been used as a placeholder...

    if (riskName.length > 100) {
        return "Risk Name needs to be 100 characters or less."
    }

    //////////////// Risk Description Validation: ////////////////

    if (typeof riskDescription !== "string" || riskDescription.trim() === "") {
        return "Risk Description is required!"
    }

    if (riskDescription.length > 150) {
        return "Risk Name needs to be 150 characters or less."
    }

    // If all checks have passed, return null
    return null;
}

const validatePatientRiskFactors = async (patientRiskFactor) => {
    if (!patientRiskFactor || typeof patientRiskFactor !== "object") {
      return "Patient Risk Factor details are required.";
    }

    const riskSeverity = Number(patientRiskFactor.RiskSeverity);
    const dateIdentified = new Date(patientRiskFactor.DateIdentified);
    const isTreated = Number(patientRiskFactor.IsTreated);

    //////////////// Risk Severity Validation: ////////////////

    if (typeof riskSeverity !== "number" || isNaN(riskSeverity)) {
        return "Risk Severity is required!"
    }

    if (riskSeverity < 1 || riskSeverity > 10) {
        return "Risk Severity needs to be between 1 and 10 inclusive."
    }

    //////////////// Date Identified Validation: ////////////////

    // NOTE: Automatically validates date through input type 'date'

    // This MUST be set to midnight to effectively ignore the time part of Date
    if (dateIdentified.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
        return "Date Identified must be before todays date!";
    }

    //////////////// Is Treated Validation: ////////////////

    if (typeof isTreated !== "number" || isNaN(isTreated)) {
        return "Is Treated is required!"
    }

    if (isTreated !== 0 && isTreated !== 1) {
        return "Is Treated needs to be either 0 or 1."
    }

    //////////////// UNIQUE Risk Validation: ////////////////

    // Ensure patient hasn't already been assigned the specific risk factor on the same date
    const query = `
        SELECT PatientRiskID
        FROM tblPatient_RiskFactors 
        WHERE PatientID = '${patientRiskFactor.PatientID}'
            AND RiskID = '${patientRiskFactor.RiskID}'
            AND DateIdentified = '${patientRiskFactor.DateIdentified}'
    `;

    const result = await runQuery(query);

    //console.log(result);

    if (result.affected_rows > 0) {
        return "Patient has already been assigned this risk for the date identified!";
    }

    // If all checks have passed, return null
    return null;
}

/////////////////////////// Validation For Patients ///////////////////////////////
const validatePatients = (patient) => {
      if (!patient || typeof patient !== "object") {
        return "Patient details are required.";
      }

      /* No need to check as it will be forced to be corrected
      const patientID = patient.patientID;
      const patientPhoneNo = Number(patient.patientPhoneNo);
      const patientEmail = (patientForename.toLowerCase() + "." + patientSurname.toLowerCase() + "@example.com")
      */

      // Actual variables the user will enter and we need to validate
      const patientForename = typeof patient.PatientForename === "string" ? patient.PatientForename.trim() : "";
      const patientSurname = typeof patient.PatientSurname === "string" ? patient.PatientSurname.trim() : "";
      const patientVillage = typeof patient.PatientVillage === "string" ? patient.PatientVillage.trim() : "";
      const patientEmail = typeof patient.PatientEmail === "string" ? patient.PatientEmail.trim() : "";
      const patientPhoneNo = typeof patient.PatientPhoneNo === "string" ? patient.PatientPhoneNo.trim() : "";

      const patientDOB = new Date(patient.PatientDOB);
      const PatientPreviousBirths = Number(patient.PatientPreviousBirths);
      const PatientNoOfPregnancies = Number(patient.PatientNoOfPregnancies);

      if (!Number.isInteger(PatientPreviousBirths) || PatientPreviousBirths < 1) {
        return "The Number of Previous Births must be greater than 0";
      }
      
      if (!Number.isInteger(PatientNoOfPregnancies) || PatientNoOfPregnancies < 1) {
        return "The Number of Pregnancies must be greater than 0";
      }

      if (patientDOB >= new Date()) {
        return "Date of birth must be before today's date";
      }

      if (!patientForename) {
        return "Patient Forename is required.";
      }

      if (patientForename.length > 100) {
        return "Patient Forename must be 100 characters or fewer.";
      }

      if (!patientSurname) {
        return "Patient Surname is required.";
      }

      if (patientSurname.length > 150) {
        return "Patient Surname must be 150 characters or fewer.";
      }

      if (!patientVillage) {
        return "Patient Village is required.";
      }

      if (patientVillage.length > 100) {
        return "Patient Village must be 100 characters or fewer.";
      }

      if (!patientEmail) {
        return "Patient Email is required.";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(patientEmail)) {
        return "Patient Email must be a valid email address.";
      }

      if (!patientPhoneNo) {
        return "Patient Phone Number is required.";
      }

      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(patientPhoneNo)) {
        return "Patient Phone Number must be a valid international phone number.";
      }

      return null;
    }


/////////////////////////// Validation For Adding Appointments ///////////////////////////////
const validateAppointments = (appointment) => {
      if (!appointment || typeof appointment !== "object") {
        return "Appointment details are required.";
      }

      /* No need to check as it will be forced to be corrected
      const appointmentID = appointment.appointmentID;
      const staffID = Number(appointment.staffID);
      const patientID = Number(appointment.patientID);
      */

      // Actual variables the user will enter and we need to validate

      const AppointmentDate = new Date(appointment.AppointmentDate);
      const appointmentNotes = typeof appointment.AppointmentNotes === "string" ? appointment.AppointmentNotes.trim() : "";
      const StatusID = appointment.StatusID;


      if (appointmentNotes.length > 500) {
        return "Appointment Notes must be 500 characters or fewer.";
      }

      if (!StatusID) {
        return "Appointment Status is required.";
      }

      return null;
    }