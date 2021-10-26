// link to database
var dbConnect = require("../dbConnect");
// sql object
const sql = require('mssql/msnodesqlv8');


const path = "/cart"

const cartRoutes = (app) => {

    // * ---------------------------- GET -------------------------------------
    // READ
    // cart by userId
    app.get(`${path}/byId/:id`, function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
        SELECT  b.UserId,
                b.BasketId,
                p.ProductId,
                p.NameProduct,
                p.UnitIntStock,
                p.UnitSalePrice as Price,
                p.Discount,
                bd.Quantity
        FROM dbo.Basket as b
        FULL JOIN dbo.BasketDetails as bd
        ON b.BasketId = bd.BasketId
        LEFT JOIN dbo.Product as p
        ON p.ProductId = bd.ProductId
        WHERE b.UserId =  ${req.params.id}
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
};
module.exports = cartRoutes;