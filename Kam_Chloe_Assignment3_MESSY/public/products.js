// creating array of products 
var products_array = [
    {
    'type': "Soccer Cleats",
    },
    {
    'type': "Soccer Uniforms",
    },
    {
    'type': "Soccer Balls",
    }

]



    var cleats =[ 
        {
            "name": "Kids Cleats",
            "quantity_available": 25,
            "image": "https://github.com/chloekamm/ITM352_F21/blob/main/Kam_Chloe_Assignment3/images/kidscleats.jpeg?raw=true" ,
            "price": 59.99
            
        },
        {
            "name": "Womens Cleats",
            "quantity_available": 25,
           "image": "https://github.com/chloekamm/ITM352_F21/blob/main/Kam_Chloe_Assignment3/images/womenscleats.jpeg?raw=true" ,
            "price": 129.99
        },
        {
            "name": "Mens Cleats",
            "quantity_available": 25,
            "image": "https://github.com/chloekamm/ITM352_F21/blob/main/Kam_Chloe_Assignment3/images/soccercleats.jpeg?raw=true" ,
            "price": 129.99
        }
    ]
    var balls=[
        {
            "name": "Blue Soccer Ball",
            "quantity_available": 25,
            "image": "https://github.com/chloekamm/ITM352_F21/blob/main/Kam_Chloe_Assignment3/images/blueball.jpeg?raw=true" ,
            "price": 12.99
        },
        {
            "name": "White Soccer Ball",
            "quantity_available": 25,
            "image": "https://github.com/chloekamm/ITM352_F21/blob/main/Kam_Chloe_Assignment3/images/whiteball.jpeg?raw=true" ,
            "price": 14.99
        },
        {
            "name": "Black Soccer Ball",
            "image": "https://github.com/chloekamm/ITM352_F21/blob/main/Kam_Chloe_Assignment3/images/blackball.jpeg?raw=true" ,
            "quantity_available": 25,
            "price": 22.99
        }
    ]
        var uniforms=[
        {
            "name": "Jersey",
            "quantity_available": 25,
            "image": "https://github.com/chloekamm/ITM352_F21/blob/main/Kam_Chloe_Assignment3/images/jersey.jpeg?raw=true" ,
            "price": 54.99
        },
        {
            "name": "Shorts",
            "quantity_available": 25,
            "image": "https://github.com/chloekamm/ITM352_F21/blob/main/Kam_Chloe_Assignment3/images/shorts.jpeg?raw=true" ,
            "price": 19.99
        },
        {
            "name": "Socks",
            "quantity_available": 25,
            "image": "https://github.com/chloekamm/ITM352_F21/blob/main/Kam_Chloe_Assignment3/images/socks.jpeg?raw=true" ,
            "price": 12.99
        }
    ]


    var productSelection = {
        "cleats": cleats , 
        "balls": balls,
        "uniforms": uniforms,
       
    }
    if (typeof module != 'undefined') {
        module.exports.productSelection = productSelection;
      }