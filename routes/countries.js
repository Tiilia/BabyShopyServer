// link to database
var dbConnect = require("../dbConnect");
// sql object
const sql = require('mssql/msnodesqlv8');


const path = "/countries"

const countriesRoutes = (app) => {

    // get all countries
    app.get(path, function(req, res){
        let request = new sql.Request(dbConnect);
        request.query(`
            SELECT c.*
            FROM dbo.Country as c
        `, 
        function (error, result) {
            if (result.length === 0) {
                result = {
                    reponse: 'error',
                    error: 'invalid path'
                }
            } else {
                result = result.recordset;
            }
            res.send(result);
        })
    })

};
module.exports = countriesRoutes;