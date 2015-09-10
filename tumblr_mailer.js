var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('peWOi3cypI_J_QfXVVw6Kw');

// Sender details
var my_name = "Sarah";
var my_email = "edkins.sarah@gmail.com";
var email_subject = "Check Out My Blog!";

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

// Tumblr API
var client = tumblr.createClient({
    consumer_key: 'eNBGowyy5OvLvc21x6t57KxlK0hdcXjHoz13gqnO0bHv5nHwrV',
    consumer_secret: '3QTxWmsznwjXVUbqUuij0FSf1lUgfSPXTqUJOOmZBLqE8guF5Q',
    token: 'TQwwN2tc5XSB9QJ3wIcU38ijKlUNoWY2YyJE5ofaiaF0ofpL01',
    token_secret: 'qH92Y1Vxdb7KDhcWrEELGIAvb14KNisoKjPAU63I88znYY0oJg'
});

client.posts('sarah-codes.tumblr.com', function(err, blog){
    if (err) throw (err.message);

    // Use EJS to produce custom emails
    for (var i = 0; i < contacts.length; i++){
        var customizedTemplate = ejs.render(email_template, {
            firstName: contacts[i].firstName,
            numMonthsSinceContact: contacts[i].numMonthsSinceContact,
            latestPosts: getRecentPosts(blog)
        });
        sendEmail(contacts[i].firstName, contacts[i].emailAddress, my_name, my_email,
            email_subject, customizedTemplate);
    }
});

function getRecentPosts(blog) {
    // Returns an array of the blog post objects that were posted within a week of current date.
    var recentPosts = [];
    var currentDate = new Date();
    currentDate = currentDate.getTime(); // Put date into milliseconds
    for (var i = 0; i < blog.posts.length; i++){
        var published = blog.posts[i].timestamp;
        published = 1000 * published; // Tumblr timestamp is in seconds, convert to milliseconds
        var diff = currentDate - published;
        if (diff <= (7 * 86400000)){  // milliseconds per week
            recentPosts.push(blog.posts[i]);
        }
    }
    return recentPosts;
}

// Send Email
function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
            "email": to_email,
            "name": to_name
        }],
        "important": false,
        "track_opens": true,
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
}





