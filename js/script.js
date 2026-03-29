/* Put your username in place of the web address to connect to the database
e.g. https://zouyang03.webhosting1.eeecs.qub.ac.uk/dbConnector.php
*/
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


        return result;
    }
    catch(error)
    {
        console.log(error.message);
    }
} 

