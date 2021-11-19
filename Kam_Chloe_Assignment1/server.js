//This is server for the store app, based on lab13 and screencast 

var products_array = require('./public/products_data');

var express = require('express');
var app = express();

var data = require('./public/products_data.js');
var products = data.products;

const qs = require('querystring');

// Monitors all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to' + request.path);
    next();
});

//Get request for products data
app.get('/products.js', function (request, response) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

//code from lab 12
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
app.use(express.urlencoded ({extended: true }));

// Get the quanitity data from the order form, then check it and if all good send it to the invoice, if not send the user back to purchase page
app.post("/process_form", function (request, response) {
    
    let POST = request.body;

    // check to make user inputs some value

    /*function validateForm() {
         for (i in request.body.quantity);
        if ([Object.keys(errors).length === 0] == "") {
          alert("Name must be filled out");
          return false;
        }
      }
      */
   // check is quantities are valid (nonnegint and have inventory)
   var errors = {};
  // errors['no_quantities'] = 'Please enter a valid quantity!';


    for(i in request.body.quantity) {
        if(!isNonNegInt(request.body.quantity[i])) {
            console.log(`${request.body.quantity[i]} is not a valid quantity for ${products[i].brand}`);
            errors['quantity'+i] = `${request.body.quantity[i]} is not a valid quantity for ${products[i].brand}`;
        
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

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback
