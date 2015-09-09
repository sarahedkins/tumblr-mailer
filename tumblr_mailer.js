var fs = require('fs');

var csvFile = fs.readFileSync("friend_list.csv","utf8");
console.log(csvFile);

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

console.log(csvParse(csvFile));