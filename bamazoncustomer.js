//create database called bamazon
//create products table
//colums - item_id(unique), product-name, department_name, price, stock_quantity
//stock with 10 items 
//this file - bamazoncustomer.js will first display all the available items for sale
//then prompt customer - id of product and then quantity
//if we have enough, fulfill order - decrease inventroy, show cost of purchase
//not enough - message insufficient quantity

//functions needed:
//display all available items (for loop to run through and check if !=0, then display)
//prompt command
//check inventory - if else
//decrease inventory
const mysql = require("mysql");
const http = require("http");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: "Legend@ry81",
    database: "bamazon"
});
connection.connect(function(err) {
    if (err) throw err;
    readDatabase();
    setTimeout(function() { askForOrder(); }, 1000);
});





function readDatabase() {
    console.log("____________________________________________________________");
    console.log("ID  Product     Department       Price         In Stock");
    console.log("___________________________________________________________")
    connection.query("select * from products", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            var item_id = res[i].item_id;
            var product_name = res[i].product_name;
            var department_name = res[i].department_name;
            var price = "$ " + res[i].price;
            var stock_quantity = res[i].stock_quantity;

            console.log("|" + item_id + " | " + product_name + " | " + department_name + " | " + price +
                " | " + stock_quantity);
        }
    });

}
// works up above

const askForOrder = () => {
    // query the database for all items with at least 1 in stock
    connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for what item they want
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Please select the item you would like to order?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like?",
                
            }
        ])
        .then(function(answer) {
            // get the information of the chosen item
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].product_name === answer.choice) {
                    chosenItem = results[i];
                }
            }

            // determine if enough stock exists
            if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
                // There is enough; subtract the quantity in the database and provide the customer's total
                var newQuantity = parseInt(chosenItem.stock_quantity) - parseInt(answer.quantity);
                var totalPrice = parseFloat(chosenItem.price) * answer.quantity;
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newQuantity,
                            product_sales: (parseFloat(chosenItem.product_sales) + parseFloat(totalPrice)).toFixed(2)
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ],
                    function(error) {
                        if (error) throw error;
                        console.log("Thanks for coming to Bamazon! Your total is $" + totalPrice + ".\n");
                        
                    }
                );
            }
            else {
                // stock_quantity wasn't high enough, so apologize 
                console.log("I'm sorry, we only have " + chosenItem.stock_quantity + " of those.\n");
               
            }
        });
    });
}
      