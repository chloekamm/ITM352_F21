var products_array = require('./public/products_data');

var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/products_data');
var products = data.products;


app.all('*', function (request, response, next) {
    console.log(request.method + ' to' + request.path);
    next();
});

app.use(myParser.urlencoded ({extended: true }));
app.post("/process_form", function (request, response) {
   // process_quantitiy_form(request.body, response);

   //checking to see if the data is being sent back 
   response.send(request.body);
});

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback


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

function process_quantitiy_form (POST, response){
    if(typeof POST['purchase_submit_button'] != 'undefined'){
        var contents = fs.readFileSync('./views/display_quanitities_template.view','utf8');
         receipt = '';
        for (i in products){
            let q = POST[`quantity_textbox${i}`];
            let model = products[i]['model'];
            let model_price = products[i]['price]'];
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


