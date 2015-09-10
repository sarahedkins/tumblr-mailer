var fs = require('fs');

// Get friend list
var csvFile = fs.readFileSync("friend_list.csv","utf8");

// Get email template
var email_template = fs.readFileSync('email_template.html', 'utf-8');


function csvParse(csvFile){
    var data_rows = [];

    // Split string into array of rows by '\n'
    var arrayOfRows = csvFile.split('\n');

    // Use first row (header) to get object keys
    var header_keys = arrayOfRows[0].split(',');

    // Loop through each line in the file & add object to array
    for (var i = 1; i < arrayOfRows.length - 1; i++){
        var row = arrayOfRows[i].split(','); // an array of values from a single row
        var object = {};
        for (var key in header_keys){
            object[header_keys[key]] = row[key];
        }
        data_rows.push(object);
    }

    // Return array of objects
    return data_rows;
}

// Create customized emails for each contact
var contacts = csvParse(csvFile);

// Loop through the contacts to produce custom emails
for (var i = 0; i < contacts.length; i++){
    var email = email_template.replace("FIRST_NAME", contacts[i].firstName);
    email = email.replace("NUM_MONTHS_SINCE_CONTACT", contacts[i].numMonthsSinceContact);
    console.log(email);
}




