/* Put your username in place of the web address to connect to the database
e.g. https://zouyang03.webhosting1.eeecs.qub.ac.uk/dbConnector.php
*/


// This Method will be the main method used to run queries 
const runQuery = async (sql) => {
    const url = "https://USERNAME.webhosting1.eeecs.qub.ac.uk/dbConnector.php";

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
      messageDiv.textContent = text;
      messageDiv.style.display = "block";
    };

/* Fills a DIV with the data of a table
- divElement: The div html where you want the table to be
- SQL: The name of the table you are retrieving the data from
- fields: The name of the fields of the table
- messageDiv: The div where the response of the message is to be displayed
              It is usually below the Form and list of a table's data
*/
const fillTable = async (divElement, SQLtableName, fields, messageDiv) =>{
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
                    alert(`Successfully deleted ${data[fields[0]]} from ${SQLtableName}`);
                    location.reload(); // Reloads the page
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
                displayMessage(`Currently editing: ${data[fields[0]]}`, messageDiv)
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
    // Gets the relating name field for the table
    if (!displayFields) {
        // Ensures the fields are stored within an Array
        displayFields = [field.replace("ID", "Name")];
    }

    // Joins the additional fields if more than 1 with the primary field
    const selectFields = [field, ...displayFields].join(", ");

    let sql = `SELECT ${selectFields} FROM ${tableName} ORDER BY ${field} ASC`
    const result = await runQuery(sql);

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

        // the displayed content is the same as the value 
        newOption.textContent = `${data[field]} - ${displayText}`;
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

/* Handles INSERTION of data into the tables
- formElement: The HTML form element to be handled
- fields: Array of field IDs (strings) that exist in the form
- tableName: The name of the database table inserting data into
- validateFunc: Function to pass in that validates the form data
- actionResult: Div that contains the element where messages are stored
*/
const handleFormSubmission = (formElement, fields, tableName, validateFunc, messageDiv) => {
    // Handles Form Submission
    formElement.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevents page reload
        
        // Object to hold form data
        const formData = {};

        // Populates the formData with key:pair values
        for (let field of fields) {
            const value = formName.querySelector(`#${field}`).value.trim();
            formData[field] = value;
        }

        // Validation happens here - calls the function in script.js specified by the function call
        const validationMessage = validateFunc(formData);
        if (validationMessage !== "PASS") {
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
            // Builds the SQL query and runs
            const sql = `INSERT INTO ${tableName} (${fieldNames.join(', ')}) VALUES (${formattedValues.join(', ')});`;
            const result = await runQuery(sql);

            // If the query is successful, tell the user
            if (result && result.success) {
                alert("Record added successfully.");
                location.reload(); // Reloads the page
            } else {
                alert(result.error);
            }
        // Update Record Logic
        } else {
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
                alert("Record updated successfully.");
                location.reload(); // Reloads the page
            } else {
                alert(result.error);
            }
        }
      
    });
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

      if (!clinicName) {
        return "Clinic name is required.";
      }

      if (clinicName.length > 150) {
        return "Clinic name must be 150 characters or fewer.";
      }

      return "PASS";
    }


const validateStaff = (staff) => {
      if (!staff || typeof staff !== "object") {
        return "Staff details are required.";
      }

      /* No need to check as it will be forced to be corrected
      const staffID = staff.staffID;
      const clinicID = staff.clinicID;
      const roleID = staff.roleID;
      const staffPhoneNo = Number(staff.staffPhoneNo);
      const staffEmail = (staffForename.toLowerCase() + "." + staffSurname.toLowerCase() + "@example.com")
      */

      // Actual variables the user will enter and we need to validate
      const staffForename = typeof staff.StaffForename === "string" ? staff.StaffForename.trim() : "";
      const staffSurname = typeof staff.StaffSurname === "string" ? staff.StaffSurname.trim() : "";

      const staffDOB = new Date(staff.StaffDOB);
      
      

      if (staffDOB >= new Date()) {
        return "Date of birth must be before today's date";
      }

      if (!staffForename) {
        return "Staff Forename is required.";
      }

      if (staffForename.length > 100) {
        return "Staff Forename must be 100 characters or fewer.";
      }

      if (!staffSurname) {
        return "Staff Surname is required.";
      }

      if (staffSurname.length > 150) {
        return "Staff Surname must be 150 characters or fewer.";
      }

      return "PASS";
    }

const validateRiskFactors = (riskFactor) => {
    return "PASS";
}