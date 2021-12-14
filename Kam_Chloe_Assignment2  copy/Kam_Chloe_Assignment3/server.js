//Chloe Kam 
//Assignment 2
//This is server for the store app, based on lab13 and screencast 



//var products_data = require('./products_data');

var express = require('express');
var app = express();
var myParser = require("body-parser");
var products_data = require('./products.json');

var filename = 'user_data.json';
const fs = require('fs');

const qs = require('querystring');
//Needed to send email 
var nodemailer = require('nodemailer');


var errors = {}; //needed to validate data 
var saved_user_quantity_array; // to tmp store user  selected quantities until needed for invoice

//Needed to applie cookies and sessions
var cookieParser = require('cookie-parser');
var session = require('express-session');
//From examples from assignment 3-- Initalize session
app.use(session({
    secret: "MySecretKey", resave: true, saveUninitialized: true
}
));

// Monitors all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to' + request.path);
    // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
    // anytime it's used
    if (typeof request.session.cart == 'undefined') { request.session.cart = {}; }
    next();

});

// get the body - if you get a POST request from a URL it will put the request in the body so you can use the data
app.use(express.urlencoded({ extended: true }));

// takes product information from json and stores in var products





app.post("/get_cart", function (request, response) {
    response.json(request.session.cart);
});

//Get request for products data
app.get("/product_data.js", function (request, response, next) {
    response.type('.js');
    var products_str = `var products_data = ${JSON.stringify(products_data)};`;
    response.send(products_str);
});

// make one that gets all user info but password
app.post("/get_user_info", function (request, response) {
    let username = request.query.username;
    let user_info = users_reg_data[username];
    delete user_info['password'];
    response.json(user_info);
});
 
/* ASSIGNMENT #3 CODE EXAMPLES NEEDED?
app.get("/add_to_cart", function (request, response) {
    var products_key = request.query['products_key']; // get the product key sent from the form post
    var quantities = request.query['quantities'].map(Number); // Get quantities from the form post and convert strings from form post to numbers
    request.session.cart[products_key] = quantities; // store the quantities array in the session cart object with the same products_key. 
    response.redirect('./cart.html');
});
*/

//code from assignment2 examples-used to login
//code from lab14 Ex3 

var filename = 'user_data.json';
if (fs.existsSync(filename)) {
    // have user_data file, so read data and parse into users_reg_data object
    let user_data_str = fs.readFileSync(filename, 'utf-8'); // reads content of the file and returns as a string
    var users_reg_data = JSON.parse(user_data_str); // parses into oject and stores in users_reg_data
    var file_stats = fs.statSync(filename);
    console.log(`${filename} has ${file_stats.size} characters`); //displayed in console 
} else {
    console.log(`Hey! ${filename} does not exist!`) //Displayed in console if file cannot be found 
    users_reg_data = {};
}

app.use(express.urlencoded({ extended: true })); // if you get a POST request from a URL it will put the request in the body so you can use the data



//Register process
app.post("/register", function (request, response) {
    username = request.body.username.toLowerCase(); //So username is not case sensitive


    // process a simple register form

    //Checking if user input is valid- 
    if (typeof users_reg_data[username] != 'undefined') {
        errors['username_taken'] = `Hey! ${username} is already registered!`;
    }
    if (typeof users_reg_data[username] == 'undefined' && (request.body['password'] == request.body['repeat_password'])) {
        users_reg_data[username] = {};
        users_reg_data[username].password = request.body['password'];
        users_reg_data[username].email = request.body['email'];
        users_reg_data[username].name = request.body['name'];

        //If data is valid, data is loading into the file of user information
        //If loaded correctly, user is directed to invoice page. 
        fs.writeFileSync('./user_data.json', JSON.stringify(users_reg_data));
        //. create querystring with users info and selected quantities
        //saved_user_quantity_array['username'] = username;
        //saved_user_quantity_array['email'] = email;
        let params = new URLSearchParams(saved_user_quantity_array);

        response.redirect('./products_display.html?products_key=Soccer%20Cleats');

        console.log("successfully registered");

        //If data is not valid, user is directed back to register page to correct errors 
    } else {
        response.redirect('./register.html' + params.toString());
        console.log("not registered");
    }
});


app.post("/login", function (request, response) {

    //empty basket of errors
    var errors = {};
    //string for messages
    var loginMessage_str = '';
    var incorrectLogin_str = '';
    let params = new URLSearchParams(request.query);

    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let login_username = request.body['username'].toLowerCase();  //So user is not case sensitive. 
    let login_password = request.body['password'];
    // check if username exists, then check password entered matches password stored

    var log_errors = []; //start with no errors 
    if (typeof users_reg_data[login_username] != 'undefined') { // if user matches what we have
        if (users_reg_data[login_username]['password'] == login_password) {
            // store username, email, and full name in the session
            request.session['username'] = login_username;
            request.session['email'] = users_reg_data[login_username]['email'];

            //display name on products display
            //Gets variable for cookie to display username on pages
            var user_info = { "username": login_username, "name": users_reg_data[login_username].name, "email": users_reg_data[login_username].email };
            //Gives cookie a expiration time, it will hold user data for 30 minutes. 
            response.cookie('user_info', JSON.stringify(user_info), { maxAge: 30 * 60 * 1000 });



            console.log(`Welcome ${request.session['username']}`);



            /* Used to store user data to display user info in assignment 2 
            let params = new URLSearchParams();
             params.append('quantity',JSON.stringify( saved_user_quantity_array));
             params.append('username',login_username);
             params.append('email',users_reg_data[login_username]['email']);
             */

            //Need to figure out a way to display username to know user is logged in. 
            //console.log(`${request.cookies} is logged in`); 

            //display name on products display

            console.log(`${login_username} successfully logged in`);

            response.redirect('./products_display.html?products_key=Soccer%20Cleats');


            return;

        } else {
            //Code examples from Tina Vo and W3schools 
            incorrectLogin_str = 'The password is incorrect, please try again!';
            console.log(errors);
            request.query.login_username = login_username;
            request.query.name = users_reg_data[login_username].name;
        }


    } else {

        incorrectLogin_str = 'The username does not exists or invalid. Please try again or register!';
        console.log(errors);
        request.query.login_username = login_username;

    }
    //make username sticky when there's an error
    //SHows error message in browser in addition to showing using with an alert. 
    response.redirect(`./login.html?loginMessage=${incorrectLogin_str}&wrong_pass=${login_username}`);

});



// NEW PROCESS LOGOUT AND QUIT SESSION


//code from lab 12
//helps to check validate data
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0;
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value. 
    else {
        if (q > 25) errors.push('Not enough in stock. '); //checks quanitity
        if (q < 0) errors.push('Negative value!'); // Check if it is non-negative

        if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer

    }
    return returnErrors ? errors : (errors.length == 0);
}
//From lab 13 
//to access inputted data from products.js
//To store user input in sessions in otder to create a shoppping cart 
// COde from assignment 2 and tweaked for Assignment 3 based off Nicole Tommee for reference. 
app.post("/add_to_cart", function (request, response, next) {
    let POST = request.body;
    var products_key = request.body['products_key']; // get the product key sent from the form post
    // Validations 
    var errors = {}; //assume no errors to start
    var empty = true // assume no quantities entered


    for (let i in products_data[products_key]) {
        q = POST['quantity' + i];
        //Checks user input for negative number or non number inputs. Notifies them if input is invalid. 
        if (isNonNegInt(q) == false) {
            errors['invalid' + i] = `${q} is not a valid quantity for ${products_data[products_key][i].name}`;
            console.log(`${q} is not a valid quantity for ${products_data[products_key][i].name}`);
        }
        //Validates if there is enough quantity of item in stock, notifys user if not
        if (q > products_data[products_key][i].quantity_available) {
            errors['quantity' + i] = `${q} items are not available for ${products_data[products_key][i].name}, only ${products_data[products_key][i].quantity_available} in stock `;
        }
        if (q > 0) {
            empty = false;
            console.log("Some quantities inputted.")
        } else if ((typeof errors['invalid' + i] != 'undefined') && (typeof errors['quantity' + i] != 'undefined')) {
            errors['empty'] = `Please enter some quantities.`;
            console.log("Please enter some quantities.");
        }
    }
    //Remove items purchased from qunatity available Code from Assignment 2;
    /* NEED TO UPDATE 
     for(let i in saved_user_quantity_array) {
       products[i].quantity_available -= Number(saved_user_quantity_array[i]);
   }
   
   */
    // if there are errors, display each error on a new line
    if (Object.keys(errors).length > 0) {
        var errorMessage_str = '';
        for (err in errors) {
            errorMessage_str += errors[err] + '\n';
        }

        let params = new URLSearchParams(request.body);
        params.append('errorMessage', errorMessage_str);
        response.redirect(`./products_display.html?${params.toString()}`);
    } else {
        // if there are no errors, put quanties into session.cart
        if (typeof request.session.cart == 'undefined') {
            request.session.cart = {}; // creates a new cart 
        }
        for (let i in products_data[products_key]) {
            if (typeof request.session.cart[products_key] == 'undefined') {
                request.session.cart[products_key] = [];
            }
            quantity_requested = Number(POST['quantity' + i]);
            // if the i item in products_key already exists in the cart, add quantities_requested to the existing value
            if (typeof request.session.cart[products_key][i] != 'undefined') {
                request.session.cart[products_key][i] += quantity_requested;
                // else if the i item in products_key doesn't exist in the cart, add quantity_requested 
            } else {
                request.session.cart[products_key][i] = quantity_requested;
            }
        }
        //Show session in console 
        console.log(request.session.cart);

    }
    let params = new URLSearchParams(request.body);
    //  params.append('products_key', products_key); 
    response.redirect(`./products_display.html?${params.toString()}`);
});
//Confirm purchases and send user a copy of invoice 

app.post("/confirm_purchase", function (request, response) {
// Generate HTML invoice string
var invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
var shopping_cart = request.session.cart;
for(product_key in products_data) {
  for(i=0; i<products_data[product_key].length; i++) {
      if(typeof shopping_cart[product_key] == 'undefined') continue;
      qty = shopping_cart[product_key][i];
      if(qty > 0) {
        invoice_str += `<tr><td>${qty}</td><td>${products_data[product_key][i].name}</td><tr>`;
      }
  }
}
invoice_str += '</table>';
// Set up mail server. Only will work on UH Network due to security restrictions
var transporter = nodemailer.createTransport({
    host: "mail.hawaii.edu",
    port: 25,
    secure: false, // use TLS
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  var user_email = 'phoney@mt2015.com';
  var mailOptions = {
    from: 'soccersaverstore@soccer.com',
    to: user_email,
    subject: 'Your soccer saver invoice',
    html: invoice_str
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      invoice_str += '<br>There was an error and your invoice could not be emailed :(';
    } else {
      invoice_str += `<br>Your invoice was mailed to ${user_email}`;
    }
    response.send(invoice_str);
  });
 


//Check is quantities still available
//Set up email invoice 
//Clear cookies and sessions. 
//Set up mail server. Only will work on UH Network due to security restrictions
// Borrowed & Modified Code from A3 Example Codes 

});

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback