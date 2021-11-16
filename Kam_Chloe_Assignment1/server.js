//This is server for the store app, based on lab13 and screencast 

var products_array = require('./public/products_data');

var express = require('express');
var app = express();

var data = require('./public/products_data.js');
var products = data.products;

const qs = require('querystring');

app.all('*', function (request, response, next) {
    console.log(request.method + ' to' + request.path);
    next();
});

app.use(express.urlencoded ({extended: true }));

// Get the quanitity data from the order form, then check it and if all good send it to the invoice, if not send the user back to purchase page
app.post("/process_form", function (request, response) {
   // check is quantities are valid (nonnegint and have inventory)
   var errors = {};
  //  errors["inventory"] =  "We don't have that many in stock";
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

//code from lab 12
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0;
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value. 
    else {

        if (q < 0) errors.push('Negative value!'); // Check if it is non-negative

        if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer

    }
    return returnErrors ? errors : (errors.length == 0);
}
/*
function process_quantitiy_form (POST, response){
    if(typeof POST['purchase_submit_button'] != 'undefined'){
        var contents = fs.readFileSync('./views/display_quanitities_template.view','utf8');
         receipt = '';

        for (i in products){
            let q = POST[`quantity_textbox${i}`];
            let item = products[i]['item'];
            let item_price = products[i]['price]'];
            if (isNonNegInt(q)) {
                receipt += eval('`' + contents + '`');
            } else{
                receipt += `<h3> <font color="red">${q} is not a valid quantity for ${model}! </h3>`;

            }
            response.send(receipt);
            response.end();
        }
    }
}
*/

