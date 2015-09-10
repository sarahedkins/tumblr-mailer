var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

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
    for (var i = 1; i <= arrayOfRows.length - 1; i++){
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

// Loop through the contacts to produce custom emails using .replace
//for (var i = 0; i < contacts.length; i++){
//    var email = email_template.replace("FIRST_NAME", contacts[i].firstName);
//    email = email.replace("NUM_MONTHS_SINCE_CONTACT", contacts[i].numMonthsSinceContact);
//    console.log(email);
//}


// Tumblr API
var client = tumblr.createClient({
    consumer_key: 'eNBGowyy5OvLvc21x6t57KxlK0hdcXjHoz13gqnO0bHv5nHwrV',
    consumer_secret: '3QTxWmsznwjXVUbqUuij0FSf1lUgfSPXTqUJOOmZBLqE8guF5Q',
    token: 'TQwwN2tc5XSB9QJ3wIcU38ijKlUNoWY2YyJE5ofaiaF0ofpL01',
    token_secret: 'qH92Y1Vxdb7KDhcWrEELGIAvb14KNisoKjPAU63I88znYY0oJg'
});

client.posts('sarah-codes.tumblr.com', function(err, blog){
    if (err) throw (err.message);
    // console.log(blog);
    console.log("Recent posts of blog: ");
    getRecentPosts(blog);
})

// Use EJS to produce custom emails
for (var i = 0; i < contacts.length; i++){
    var customizedTemplate = ejs.render(email_template, {
        firstName: contacts[i].firstName,
        numMonthsSinceContact: contacts[i].numMonthsSinceContact
    });
    console.log(customizedTemplate);
}

function getRecentPosts(blog) {
    var currentDate = new Date();
    currentDate = currentDate.getTime(); // Put date into milliseconds
    for (var i = 0; i < blog.posts.length; i++){
        var postTimestamp = blog.posts[i].timestamp;
        postTimestamp = 1000 * postTimestamp; // Tumblr timestamp is in seconds, convert to milliseconds
        var diff = currentDate - postTimestamp;
        if (diff <= (7 * 86400000)){  // milliseconds per week
            console.log("This post is in range ");
            console.log(blog.posts[i].title);
        }
    }
}






