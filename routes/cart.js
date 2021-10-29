// link to database
var dbConnect = require("../dbConnect");
// sql object
const sql = require('mssql/msnodesqlv8');


const path = "/cart"

const cartRoutes = (app, sock) => {

    // * ---------------------------- GET -------------------------------------
    // READ
    // cart by userId
    app.get(`${path}/byUserId/:id`, function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
        SELECT  b.UserId,
                b.BasketId,
                bd.BasketDetailsId,
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
                    result = result.recordset;
                }
                res.send(result);
            });
    });
    // get grandTotal
    // READ
    // cart by userId
    app.get(`${path}/priceTotalbyUserId/:id`, function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
            SELECT SUM((p.UnitSalePrice - COALESCE(p.Discount, 0)) * bd.Quantity) as GrandTotal
            FROM dbo.Basket as b
            FULL JOIN dbo.BasketDetails as bd
            ON b.BasketId = bd.BasketId
            LEFT JOIN dbo.Product as p
            ON p.ProductId = bd.ProductId
            WHERE b.UserId = ${req.params.id}
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
    // ? ADD product in cart ---------------------------------------------------
    app.post(`${path}/add`, (req, res) => {
        let content = req.body;
        console.log(`------ post: ${content}`);
        const notify = {data: content}
        console.log(content);
        let request = new sql.Request(dbConnect);
        request.query(`
            INSERT INTO dbo.BasketDetails VALUES (
                ${content.BasketId},
                NULL,
                ${content.ProductId},
                ${content.Quantity}
                )
            `,
            (error, result) => {
                if (error) console.error(error);
                else res.send(notify);
            });
    });

    // ? UPDATE quantity ---------------------------------------------------------
    app.post(`${path}/update`, (req, res) => {
        let content = req.body;
        console.log(`------ post: ${content}`);
        const notify = {data: content}
        sock.emit('notification', notify)
        let request = new sql.Request(dbConnect);
        request.query(`
            UPDATE dbo.BasketDetails
            SET Quantity = ${content.Quantity}
            WHERE BasketDetailsId = ${content.BasketDetailsId}
            `,
            (error, result) => {
                if (error) console.error(error);
                else {
                    console.log(`---------- result: ${result.rowsAffected}`)
                    res.send(notify)};
            });
    });

    // ? DELETE one product ----------------------------------------------------------
    app.post(`${path}/delete`, (req, res) => {
        let content = req.body;
        console.log(`------ post: ${content}`);
        const notify = {data: content}
        console.log(content);
        let request = new sql.Request(dbConnect);
        request.query(`
            DELETE FROM dbo.BasketDetails
            WHERE BasketDetailsId = ${content.BasketDetailsId}
            `,
            (error, result) => {
                if (error) console.error(error);
                else res.send(notify);
            });
    });
    // DELETE ALL -------------------------------------------------------------------
    app.post(`${path}/deleteAll`, (req, res) => {
        let content = req.body;
        console.log(`------ post: ${content}`);
        const notify = {data: content}
        console.log(content);
        let request = new sql.Request(dbConnect);
        request.query(`
            DELETE FROM dbo.BasketDetails
            WHERE BasketId = ${content.BasketId}
            `,
            (error, result) => {
                if (error) console.error(error);
                else res.send(notify);
            });
    });
};
module.exports = cartRoutes;