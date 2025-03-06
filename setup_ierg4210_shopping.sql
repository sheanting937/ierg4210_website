CREATE DATABASE ierg4210_shopping;

USE ierg4210_shopping;

CREATE TABLE categories (
    catid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO categories (name) VALUES ('vegetables');
INSERT INTO categories (name) VALUES ('fruits');
INSERT INTO categories (name) VALUES ('meats');

CREATE TABLE products (
    pid INT AUTO_INCREMENT PRIMARY KEY,
    catid INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    FOREIGN KEY (catid) REFERENCES categories(catid)
);

INSERT INTO products (catid, name, price, description, image)
VALUES ((SELECT catid FROM categories WHERE name = 'vegetables'), 'carrot', 10.00, 'The carrot is a root vegetable, typically orange in colour, though heirloom variants including purple, black, red, white, and yellow cultivars exist, all of which are domesticated forms of the wild carrot, Daucus carota, native to Europe and Southwestern Asia.', '/images/carrot.jpg');
INSERT INTO products (catid, name, price, description, image)
VALUES ((SELECT catid FROM categories WHERE name = 'vegetables'), 'tomato', 15.00, 'The tomato is a plant whose fruit is an edible berry that is eaten as a vegetable. The tomato is a member of the nightshade family that includes tobacco, potato, and chili peppers.', '/images/tomato.jpg');

INSERT INTO products (catid, name, price, description, image)
VALUES ((SELECT catid FROM categories WHERE name = 'fruits'), 'apple', 10.00, 'An apple is a round, edible fruit produced by an apple tree.', '/images/apple.jpg');
INSERT INTO products (catid, name, price, description, image)
VALUES ((SELECT catid FROM categories WHERE name = 'fruits'), 'banana', 5.00, 'A banana is an elongated, edible fruit - botanically a berry - produced by several kinds of large treelike herbaceous flowering plants in the genus Musa.', '/images/banana.jpg');

INSERT INTO products (catid, name, price, description, image)
VALUES ((SELECT catid FROM categories WHERE name = 'meats'), 'chicken', 25.00, 'The chicken is a large and round short-winged bird, domesticated from the red junglefowl of Southeast Asia around 8,000 years ago.', '/images/chicken.jpg');
INSERT INTO products (catid, name, price, description, image)
VALUES ((SELECT catid FROM categories WHERE name = 'meats'), 'pork', 30.00, 'Pork is the culinary name for the meat of the pig. It is the most commonly consumed meat worldwide, with evidence of pig husbandry dating back to 5000 BCE.', '/images/pork.jpg');