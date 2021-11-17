

var attributes  =  "Chloe;20;20.5;-19.5";

var parts= attributes.split(';');
/*
for(part of parts){
 
    console.log(`${part} isNonNegInt: ${iisNonNegInt(part,true)}`);
}
*/

parts.forEach(checkIt);

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value. 
if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer


return returnErrors ? errors : (errors.length == 0)
}


attributes ="Chloe;20;20.5;-19.5";
parts= attributes.split(';');

parts.forEach(
    (item, index) => {
        console.log(`part ${index} is ${(isNonNegInt(item)?'a':'not a')} quantity`);
    }
)

