//Chloe Kam 
//Assignment 2
//This is server for the store app, based on lab13 and screencast 

//This is server for the store app, based on lab13 and screencast 

//var products_data = require('./products_data');

var express = require('express');
var app = express();
var myParser = require("body-parser");
var products_data = require('./products.json');

var filename = 'user_data.json';
const fs = require('fs');

const qs = require('querystring');

var errors = {}; //needed to validate data 
var saved_user_quantity_array; // to tmp store user  selected quantities until needed for invoice

//Needed to applie cookies and sessions
var cookieParser = require('cookie-parser');
var session = require('express-session');
//From examples from assignment 3
app.use(session({ secret: "MySecretKey", resave: true, saveUninitialized: true }));

// Monitors all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to' + request.path);
    next();
});
//Get request for products data
app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});
//Request to get cart function
app.get("/get_cart", function (request, response) {
    response.json(request.session.cart);
})
// routing
app.get("/product_data.js", function (request, response, next) {
    response.type('.js');
    var products_str = `var products_data = ${JSON.stringify(products_data)};`;
    response.send(products_str);
});



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
    if(typeof users_reg_data[username] !='undefined'){
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
        saved_user_quantity_array['username'] = username;
        //saved_user_quantity_array['email'] = email;
        let params = new URLSearchParams(saved_user_quantity_array);

        response.redirect('./invoice.html?'+ params.toString());

        console.log("successfully registered");

        //If data is not valid, user is directed back to register page to correct errors 
    } else {
        response.redirect('./register.html'+ params.toString());
        console.log("not registered");
    }
});


app.post("/login", function (request, response) {

//empty basket of errors
var errors = {}; 
//string for messages
var loginMessage_str = '';
var incorrectLogin_str = '';
    
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let login_username = request.body['username'].toLowerCase();  //So user is not case sensitive. 
    let login_password = request.body['password'];
    // check if username exists, then check password entered matches password stored
    
    var log_errors = []; //start with no errors 
    if (typeof users_reg_data[login_username] != 'undefined') { // if user matches what we have
        if (users_reg_data[login_username]['password'] == login_password) {
            
            let params = new URLSearchParams();
            params.append('quantity',JSON.stringify( saved_user_quantity_array));
            params.append('username',login_username);
            params.append('email',users_reg_data[login_username]['email']);

            //Remove items purchased from qunatity available 
            for(let i in saved_user_quantity_array) {
                products[i].quantity_available -= Number(saved_user_quantity_array[i]);
            }
           //Need to figure out a way to display username to know user is logged in. 
            //console.log(`${request.cookies} is logged in`); 

             //display name on products display
           
            console.log(`${login_username} successfully logged in`);
            response.redirect('./products_display.html?products_key=Soccer%20Cleats');
          
           
          return;
             
        } else {
            //Code examples from Tina Vo and W3schools 
            incorrectLogin_str = 'The password is incorrect, plese try again!';
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
app.use(express.urlencoded({ extended: true }));

//POST method to get users selected items in cart



//route all other GEt requests to files in the public folder. 
app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback