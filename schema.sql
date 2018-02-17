### Schema
CREATE bamazon;

USE bamazon;

create table products(
	item_id INT (11) AUTO_INCREMENT NOT NULL,
    product_name varchar(140) NOT NULL,
    department_name varchar(140) NOT NULL,
    price INT(10) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    product_sales INT(10),
    PRIMARY KEY (ID)
    );
    