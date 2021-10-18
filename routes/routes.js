// routes declarations
const usersRoutes = require("./users")


const appRouter = (app) => {

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
        `);
    });
    usersRoutes(app);
};
module.exports = appRouter;