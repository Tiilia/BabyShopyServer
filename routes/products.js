// link to database
var dbConnect = require("../dbConnect");
// sql object
const sql = require('mssql/msnodesqlv8');


const path = "/products"

const productsRoutes = (app) => {

    // * ---------------------------- GET -------------------------------------
    // READ
    // all categories
    app.get(path, function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
            SELECT p.ProductId,
                    p.ProductRef,
                    c.NameCategory,
                    p.NameProduct,
                    p.Summary,
                    p.UnitSalePrice,
                    p.UnitPurchasePrice,
                    p.Discount,
                    p.UnitIntStock
            FROM dbo.Product as p
            LEFT JOIN dbo.Category as c
            ON p.CategoryId = c.CategoryId
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
            SELECT p.ProductId,
                    p.ProductRef,
                    c.NameCategory,
                    p.NameProduct,
                    p.Summary,
                    p.UnitSalePrice,
                    p.UnitPurchasePrice,
                    p.Discount,
                    p.UnitIntStock
            FROM dbo.Product as p
            LEFT JOIN dbo.Category as c
            ON p.CategoryId = c.CategoryId
            WHERE p.ProductId = ${req.params.id}
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
    // by category id
    app.get(`${path}/byCategory/:id`, function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
            SELECT p.ProductId,
                    p.ProductRef,
                    c.NameCategory,
                    p.NameProduct,
                    p.Summary,
                    p.UnitSalePrice,
                    p.UnitPurchasePrice,
                    p.Discount,
                    p.UnitIntStock
            FROM dbo.Product as p
            LEFT JOIN dbo.Category as c
            ON p.CategoryId = c.CategoryId
            WHERE c.CategoryId = ${req.params.id}
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
    // * ----------------------------------- POST --------------------------------------------
    // CREATE

};
module.exports = productsRoutes;