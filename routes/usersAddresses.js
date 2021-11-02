// link to database
var dbConnect = require("../dbConnect");
// sql object
const sql = require('mssql/msnodesqlv8');


const path = "/usersAddresses"

const usersAddressesRoutes = (app) => {

   
    // get address information by user id
    app.get(`${path}/userId/:id`, function(req, res){
        let request = new sql.Request(dbConnect);
        request.query(`
        SELECT u.UserId,
               u.FirstName,
               u.LastName,
               u.[Address],
               u.AddressNumber,
               u.City,
               u.PostalCode,
               c.CountryName
        FROM dbo.[User] as u
        LEFT jOIN dbo.Country as c
        ON c.CountryId = u.CountryId
        WHERE u.UserId = ${req.params.id}
        `, 
        function (error, result) {
            if (error) {
                console.log(error);
            } else {
                result = result.recordset[0];
            }
            res.send(result);
        })
    })

};
module.exports = usersAddressesRoutes;