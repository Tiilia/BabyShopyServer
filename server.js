// chargement express et body-parser
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// db link
var dbConnect = require("./dbConnect");

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));


// création des routes
const routes = require('./routes/routes.js')(app);

// lancement du serveur au port 3000
const server = app.listen(3000, () => {
    console.log('listening on port %s...', server.address().port);
});