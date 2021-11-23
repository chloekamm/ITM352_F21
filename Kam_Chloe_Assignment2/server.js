//This is server for the store app, based on lab13 and screencast 

var products_array = require('./public/products_data');

var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./public/products_data.js');
var products = data.products;
var filename = 'user_data.json';
var fs = require('fs');
const fs = require('fs');

const { response } = require('express');


const qs = require('querystring');

// Monitors all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to' + request.path);
    next();
});

//code from assignment2 examples-used to login
//code from lab14 Ex3 

var filename = 'user_data.json';
if (fs.existsSync(filename)){
    // have user_data file, so read data and parse into users_registration_info object
    let user_data_str = fs.readFileSync(filename, 'utf-8'); // reads content of the file and returns as a string
    var users_registration_info = JSON.parse(user_data_str); // parses into oject and stores in users_registration_info
    var file_stats = fs.statSync(filename);
    console.log(`${filename} has ${file_stats.size} characters`);
} else {
    console.log(`Hey! ${filename} does not exist!`)
}

app.get("/", function (request,response) {
    response.send("Nothing here!");
});

app.use(express.urlencoded({ extended: true })); // if you get a POST request from a URL it will put the request in the body so you can use the data

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
    
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
`;
    response.send(str);
 });

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let login_username = request.body['username'];
    let login_password = request.body['password'];
    // checks passwaord if user name exissts
    if (typeof users_registration_info[login_username] != 'undefined'){ // if user matches what we have
        if(users_registration_info[login_username]['password'] == login_password) {
            response.send(`${login_username} is logged in`);
        } else {
            response.redirect(`./login?err=incorrect password for ${login_username} `); 
        }
    } else {
        response.redirect(`./login?err=${login_username} does not exist`);
    }

    response.send('Processing login' + JSON.stringify(request.body)) // request.body holds the username & password- forms data 

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
        if(q>25) errors.push('Not enough in stock. '); //checks quanitity
        if (q < 0) errors.push('Negative value!'); // Check if it is non-negative

        if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer

    }
    return returnErrors ? errors : (errors.length == 0);
}
//From lab 13 
//to access inputted data from products.js
app.use(express.urlencoded ({extended: true }));

// Get the quanitity data from the order form, then check it and if all good send it to the invoice, if not send the user back to purchase page
app.post("/process_form", function (request, response) {
    
    let POST = request.body;

    // check to make user inputs some value

   // check is quantities are valid (nonnegint and have inventory)
   var errors = {};


    for(i in request.body.quantity) {
        if(!isNonNegInt(request.body.quantity[i])) {
            console.log(`${request.body.quantity[i]} is not a valid quantity for ${products[i].brand}`);
            errors['quantity'+i] = `${request.body.quantity[i]} is not a valid quantity for ${products[i].brand}`;
        
        }
        if((!isNonNegInt)>products[i].inventory){
            errors['inventory'+i] = ` We do not have ${request.body.quantity[i]} products in stock for ${products[i].brand} sorry for inconvenience ` ;
        
        
    }
}
    
   let qty_obj = {"quantity": JSON.stringify(request.body.quantity)};
   if(Object.keys(errors).length === 0) {
      

    //If data is valid, create invoice
    response.redirect('./invoice.html?' + qs.stringify(qty_obj));
   } else {
    qty_obj.errors = JSON.stringify(errors);
    response.redirect('./products_display.html?' + qs.stringify(qty_obj));
   }
});
//route all other GEt requests to files in the public folder. 
app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback
