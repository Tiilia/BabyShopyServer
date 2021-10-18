// link to database
var dbConnect = require("../dbConnect");
// sql object
const sql = require('mssql/msnodesqlv8');


const path = "/categories"

const categoriesRoutes = (app) => {

    // * ---------------------------- GET -------------------------------------
    // READ
    // all categories
    app.get(path, function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
            SELECT c.*
            FROM dbo.[Category] as c
        `,
            function (error, result, fields) {
                if (result.length === 0) {
                    result = {
                        reponse: 'error',
                        error: 'invalid path'
                    }
                } else {
                    result = result.recordset;
                }
                res.send(result);
            });
    });

    // by id
    app.get(`${path}/byId/:id`, function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
            SELECT c.*
            FROM dbo.[Category] as c
            WHERE c.CategoryId = ${req.params.id}
        `,
            function (error, result, fields) {
                if (result.length === 0) {
                    result = {
                        reponse: 'error',
                        error: 'invalid path'
                    }
                } else {
                    result = result.recordset[0];
                }
                res.send(result);
            });
    });

    // * ----------------------------------- POST --------------------------------------------
    // CREATE

};
module.exports = categoriesRoutes;