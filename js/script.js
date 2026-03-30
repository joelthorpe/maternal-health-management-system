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

/* Fetch the latest ID value of a table
    Requires the name of the table, field name, and the primary key prefix
*/
const generateLatestID = async(tableName, fieldName, prefix) => {
    // query
    const sql = `SELECT ${fieldName} FROM ${tableName} ORDER BY ${fieldName} DESC LIMIT 1`;
    const result = await runQuery(sql);

    let nextID = `${prefix}001`; // assigns to default value if empty

    // ensures data isn't empty
    if (result && result.data && result.data.length > 0) {
        //console.log(result);
        const lastID = result.data[0][fieldName];

        // extracts number after the prefix and increments it
        const numPart = parseInt(lastID.substring(prefix.length));
        const nextNum = numPart + 1;

        nextID = prefix + nextNum.toString().padStart(3, '0');
    }

    return nextID;
};

/* Populates a table based on the database tablename specified
    Requies the table name in the DB, the field name (usually primary key field), and headings for the table (as a list)
*/
const listTable = async(tableName, fieldName, headings) => {
    // ensure it is called the same amongst ALl files that require it
    const output = document.querySelector("#tblOutput");

    // can change this if required, currently grabs all records in table
    const sql = `SELECT * FROM ${tableName} ORDER BY ${fieldName}`;
    const result = await runQuery(sql);

    // ensures result isn't empty or has no length
    if (!result || !result.data || result.data.length === 0) {
        output.textContent = "No records found.";
        return;
    }

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    table.appendChild(headerRow);

    // output headings in the order stored in list
    for (let heading of headings) {
        const th = document.createElement("th");
        th.textContent = heading;
        headerRow.appendChild(th);
    }

    // for each key:value pair in the list
    for (let row of result.data) {
        const tr = document.createElement("tr");

        for (let key in row) {
            // check to see if field name includes forename
            if (key.includes("Forename")) {
                const td = document.createElement("td");
                // finds the 'prefix' before forename e.g. patient/staff - better way of doing this?
                const prefix = key.replace("Forename", "");
                // gets forename value and surname value and appends
                td.textContent = `${row[prefix + "Forename"]} ${row[prefix + "Surname"]}`;
                tr.appendChild(td);
                continue;
            }
            // skips surname field
            if (key.includes("Surname")) {
                continue;
            }

            const td = document.createElement("td");
            td.textContent = row[key];
            tr.appendChild(td);
        }

        const tdAction = document.createElement("td");

        // logic for edit and deletion needs to be done below
        // edit should send data to form
        // delete should work based on tblName, fieldName etc

        // edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        tdAction.appendChild(editBtn);
        editBtn.addEventListener("click", async () => {
            alert("Add edit functionality - should open the add/edit patient data dialog")
            modal.showModal();
        });

        // delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        tdAction.appendChild(deleteBtn);
        deleteBtn.addEventListener("click", async () => {
            // prompts the user if they want to delete the record
            if (!confirm(`Are you sure you want to delete ${row[fieldName]} record in ${tableName}?`)) return;

            // builds the query and runs it
            const deleteSql = `DELETE FROM ${tableName} WHERE ${fieldName} = '${row[fieldName]}'`;
            const deleteResult = await runQuery(deleteSql);

            // if successful, tell the user
            if (deleteResult && deleteResult.success) {
                alert("Deleted successfully.");
                location.reload();
            // else, tell the user
            } else {
                alert(deleteResult.error || "Unable to delete record.");
            }
            });

        tr.appendChild(tdAction);
        table.appendChild(tr);
    }

    output.appendChild(table);

}

/* Handles the submission of the forms
    Requies the formSelector (form class name), table name in the DB, and the fields to be submitted
*/
const handleFormSubmit = async ({formSelector, tableName, fields}) => {
    formSelector.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {};

        for (let field of fields) {
            const value = formSelector.querySelector(`#${field}`).value.trim();
            formData[field] = value;
        }

        // query
        // gets keys and values from the array
        const fieldNames = Object.keys(formData);
        const fieldValues = Object.values(formData);

        console.log(fieldNames);
        console.log(fieldValues);

        // put values into singular quotes
        const formattedValues = fieldValues.map(val => {
            // check to ensure that the value is a number
            return isNaN(val) ? `'${val}'` : val;
        });

        const sql = `INSERT INTO ${tableName} (${fieldNames.join(', ')}) VALUES (${formattedValues.join(', ')});`;

        const result = await runQuery(sql);

        if (result && result.success) {
            alert("Record added successfully.");
            location.reload();
        } else {
            alert(result.error);
        }
    });
};

/* Populates the dropdowns in the forms
    Requires the query selector (form name), fields to fetch for the drop-down, tablename, orderby, and default text (e.g. Select Clinics)
*/
const populateDropdown = async (querySelector, fields, tableName, orderBy, defaultText) => {
    const select = document.querySelector(querySelector);

    const str = fields.join(", ");
    
    console.log(str);

    // get data
    const sql = `SELECT ${str} FROM ${tableName} ORDER BY ${orderBy} ASC`
    const result = await runQuery(sql);

    console.log(result);

    // clear existing options
    select.innerHTML = "";

    // default options
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = defaultText;
    select.appendChild(defaultOption);

    // populate dropdown
    for (let row of result.data) {
        const option = document.createElement("option");
        option.value = row[fields[0]];
        let str = "";
        for (let field of fields) {
            str += row[field] + " ";
        }
        option.textContent = str.trim();
        select.appendChild(option);
    }

    console.log(result);
}

/* Fetches the latest available ID value
    Requires the form name class, table name, field name (usually primary key), prefixes (from primary key), headings for the table, and the fields in the DB and form (must match)
*/
const initForm = async (form, tableName, fieldName, prefix, tblHeadings, fields) => {
    const formSelector = document.querySelector(form)
    // ensures that it exists before trying to populate
    if (formSelector) {
        formSelector.reset();
        // fetch and set the next available ID automatically
        const nextID = await generateLatestID(tableName, fieldName, prefix);
        const idInput = document.querySelector("#" + fieldName);
        idInput.value = nextID;

        // NOTE: populate the below with all other dropdown options...
        if (document.querySelector("#ClinicID")) {
            await populateDropdown("#ClinicID", ["ClinicID", "ClinicName"], "tblClinic", "ClinicID", "Select Clinic")
        }
        if (document.querySelector("#RoleID")) {
            await populateDropdown("#RoleID", ["RoleID", "RoleName"], "tblRole", "RoleID", "Select Role")
        }
        if (document.querySelector("#StaffID")) {
            await populateDropdown("#StaffID", ["StaffID", "StaffForename", "StaffSurname"], "tblStaff", "StaffID", "Select Staff")
        }
        if (document.querySelector("#PatientID")) {
            await populateDropdown("#PatientID", ["PatientID", "PatientForename", "PatientSurname"], "tblPatient", "PatientID", "Select Patient")
        }
        if (document.querySelector("#AppointmentStatus")) {
            await populateDropdown("#AppointmentStatus", ["StatusID", "StatusName"], "tblAppointment_Status", "StatusID", "Select Status")
        }
        if (document.querySelector("#RegionID")) {
            await populateDropdown("#RegionID", ["RegionID", "RegionName"], "tblRegion", "RegionID", "Select Region")
        }

        // create and populate the table
        listTable(tableName, fieldName, tblHeadings);

        // handle the submission of form
        handleFormSubmit({
            formSelector: formSelector,
            tableName: tableName,
            fields: fields
        });
    }
};

// Initialisation
// In here, each table needs initialising for information
// Format is: form id, table name in db, primary key field in db, prefix of primary key, headings for the tables, and field ids within the form and the database (need to match)
// NOTE: Might be a better way to represent this, but it works for the time being
document.addEventListener("DOMContentLoaded", async () => {
    // initialises the patient table
    initForm(
        "#patientForm",
        "tblPatient",
        "PatientID",
        "P",
        ["ID", "Name", "Clinic", "DOB", "Village", "Email", "Phone No", "Previous Births", "Number of Pregnancies", "Actions"],
        ["PatientID","PatientForename","PatientSurname","ClinicID","PatientDOB","PatientVillage","PatientEmail","PatientPhoneNo","PatientPreviousBirths","PatientNoOfPregnancies"]
    );

    // initialises the staff table
    initForm(
        "#staffForm",
        "tblStaff",
        "StaffID",
        "S",
        ["ID", "Clinic", "Role", "Name", "DOB", "Email", "Phone No", "Actions"],
        ["StaffID","ClinicID","RoleID","StaffForename","StaffSurname","StaffDOB","StaffEmail","StaffPhoneNo"]
    );


    // initialises the appointments table
    initForm(
        "#appointmentForm",
        "tblAppointment",
        "AppointmentID",
        "A",
        ["Appoinment ID", "Staff ID", "Patient ID", "Appointment Date", "Appointment Notes", "Appointment Status", "Actions"],
        ["AppointmentID","StaffID","PatientID","AppointmentDate","AppointmentNotes","AppointmentStatus"]
    );

    // initialises the clinic table
    initForm(
        "#clinicForm",
        "tblClinic",
        "ClinicID",
        "C",
        ["Clinic ID", "Region ID", "Clinic Name", "Clinic Capacity", "Actions"],
        ["ClinicID","RegionID","ClinicName","ClinicCapacity"]
    );

});

const validateClinic = (clinic) => {
    if (!clinic || typeof clinic !== "object") {
      return "Clinic details are required.";
    }

    const clinicID = clinic.clinicID;
    const regionID = clinic.regionID;
    const clinicName = typeof clinic.clinicName === "string" ? clinic.clinicName.trim() : "";
    const clinicCapacity = Number(clinic.clinicCapacity);

    if (!Number.isInteger(clinicCapacity) || clinicCapacity < 1) {
      return "The Clinic capacity must be greater than";
    }

    if (!clinicName) {
      return "Clinic name is required.";
    }

    if (clinicName.length > 150) {
      return "Clinic name must be 150 characters or fewer.";
    }

    return "";
  }