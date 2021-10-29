// routes declarations
const usersRoutes = require("./users")
const categoriesRoutes = require("./categories")
const productsRoutes = require("./products")
const authRoutes = require("./auth")
const cartRoutes = require("./cart")
const coutriesRoutes = require("./countries")

const appRouter = (app,sock) => {

    app.get('/', (req, res) => {
        res.send(`
            <style type="text/css">
            body {
                font-family:  Arial, Helvetica, sans-serif;
                margin: 50px;
                color: DarkSlateBlue;
            }
            </style>
            <h2>Welcome to the BabyShopy api-server! </h2>
            <h3>Routes:</h3>
            <p>Users: /users</p>
            <p>Users by id: /users/byId/:id</p>
            <p>Categories: /categories</p>
            <p>Categories by id: /categories/byId/:id</p>
            <p>Products: /products</p>
        `);
    });
    usersRoutes(app);
    categoriesRoutes(app);
    productsRoutes(app);
    authRoutes(app);
    cartRoutes(app,sock);
    coutriesRoutes(app);
};
module.exports = appRouter;