//This is server for the store app, based on lab13 and screencast 

var products_array = require('./public/products_data');

var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./public/products_data.js');
var products = data.products;
var filename = 'user_data.json';
const fs = require('fs');

const qs = require('querystring');

var errors = {}; //needed to validate data 
var saved_user_quantity_array; // to tmp store user  selected quantities until needed for invoice

// Monitors all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to' + request.path);
    next();
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


    
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let login_username = request.body['username'].toLowerCase();  //So user is not case sensitive. 
    let login_password = request.body['password'];
    // check if username exists, then check password entered matches password stored
    
    if (typeof users_reg_data[login_username] != 'undefined') { // if user matches what we have
        if (users_reg_data[login_username]['password'] == login_password) {
            saved_user_quantity_array['username'] = login_username;
            saved_user_quantity_array['email'] = users_reg_data[login_username]['email']; 
            let params = new URLSearchParams(saved_user_quantity_array);

            response.redirect('./invoice.html?'+ params.toString());
          
            console.log(`successfully logged in`);
          return;
             
        } else {
            //errors['logerrors']=  `${login_password} is incorrect for ${login_username} `;
           
            response.redirect(`./login.html?err=incorrect password for ${login_username} `);
            console.log('password is incorrect, please try again');
        
        return;
        }
      

    } else {
        response.redirect(`./login.html?err=${login_username} does not exist`);
        console.log('username does not exist, please register');
     
    }

    //response.send('Processing login' + JSON.stringify(request.body)) // request.body holds the username & password (the form data when it got posted)

});
//Get request for products data
app.get('/products.js', function (request, response) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
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

// Get the quanitity data from the order form, then check it and if all good send it to the invoice, if not send the user back to purchase page
app.post("/process_form", function (request, response) {
    
    // check to make user inputs some value

    // check is quantities are valid (nonnegint and have inventory)
    var errors = {};


    for (i in request.body.quantity) {
        if (!isNonNegInt(request.body.quantity[i])) {
            console.log(`${request.body.quantity[i]} is not a valid quantity for ${products[i].brand}`);
            errors['quantity' + i] = `${request.body.quantity[i]} is not a valid quantity for ${products[i].brand}`;

        }
        if ((!isNonNegInt) > products[i].inventory) {
            errors['inventory' + i] = ` We do not have ${request.body.quantity[i]} products in stock for ${products[i].brand} sorry for inconvenience `;


        }
    }

    let qty_obj = { "quantity": JSON.stringify(request.body.quantity) };
    if (Object.keys(errors).length === 0) {
        // save user quantities on server for later use in invoice (note: another user after will overwrite saved data)
        saved_user_quantity_array = qty_obj;
        //If data is valid, go to login to then direct user to invoice once logged in. 
        response.redirect('./login.html?' );
    } else {
        qty_obj.errors = JSON.stringify(errors);
        response.redirect('./products_display.html?' );
    }
});
//route all other GEt requests to files in the public folder. 
app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback
