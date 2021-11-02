// link to database
var dbConnect = require("../dbConnect");
// sql object
const sql = require('mssql/msnodesqlv8');



const path = "/orders"

const ordersRoutes = (app) => {

    // get all orders (admin)
    app.get(`${path}`, function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
        SELECT od.OrderDetailsId,
               od.OrderId,
               o.OrderDate,
               o.[Status],
               o.FirstName,
               o.LastName,
               o.[Address],
               o.AdressNumber,
               o.City,
               o.PostalCode,
               c.CountryName,
               p.NameProduct,
               od.Quantity,
               od.UnitPrice
        FROM [Order] as o
        RIGHT JOIN dbo.OrderDetails as od
        ON od.OrderId = o.OrderId
        LEFT JOIN dbo.Country as c
        ON c.CountryId = o.CountryId
        LEFT JOIN dbo.Product as p
        ON p.ProductId = od.ProductId
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
    // get all orders by id user
    app.get(`${path}/userId/:id`, async function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
        SELECT o.OrderId,
                o.UserId,
                o.OrderDate,
                o.[Status],
                o.FirstName,
                o.LastName,
                o.[Address],
                o.AdressNumber,
                o.City,
                o.PostalCode,
                c.CountryName
        FROM dbo.[Order] as o
        LEFT JOIN dbo.Country as c
        ON c.CountryId = o.CountryId
        WHERE o.UserId = ${req.params.id}
        `,
            async function (error, result) {
                if (error) {
                    console.log(error)
                } else {
                    let orderInfos = []
                    for (const o of result.recordset) {
                        orderInfos.push({
                            OrderId: o.OrderId,
                            UserId: o.UserId,
                            OrderDate: o.OrderDate,
                            Status: o.Status,
                            UserAddress: {
                                UserId: o.UserId,
                                FirstName: o.FirstName,
                                LastName: o.LastName,
                                Address: o.Address,
                                AddressNumber: o.AddressNumber,
                                City: o.City,
                                PostalCode: o.PostalCode,
                                CountryName: o.CountryName
                            },
                            CartElements: []
                        })

                    }
                    orderInfos = await getDetails(orderInfos);

                    console.log(orderInfos);
                    res.send(orderInfos)



                }
            })

    })

    // * post order bu user id
    app.post(`${path}/:id`, (req, res) => {
        let content = req.body;
        console.log(content);
        let request = new sql.Request(dbConnect);
        request.query(`
            INSERT INTO dbo.[Order] VALUES(
                ${content.UserId},
                '2021-11-02',
                ${content.Status},
                ${content.UserAddress.FirstName},
                ${content.UserAddress.LastName},
                ${content.UserAddress.Address},
                ${content.UserAddress.AddressNumber},
                ${content.UserAddress.City},
                ${content.UserAddress.PostalCode},
                (SELECT c.CountryId 
                    FROM dbo.Country as c 
                    WHERE c.CountryName = '${content.UserAddress.CountryName}')
            )
        `,
        (error, result) => {
            if (error) console.error(error);})
        // for (const element of content.CartElements) {
        //     request.query(`
        //         INSERT INTO dbo.[OrderDetails] VALUES(
        //             (SELECT max(OrderId) FROM dbo.[Order]),
        //             ${element.ProductId},
        //             ${element.Quantity},
        //             ${element.Price},
        //             ${element.Discount}
        //         )
        //     `)
            
        // }
        res.send(content)
    })

};

const getDetails = async (orders) => {
    let request = new sql.Request(dbConnect);
    for (const order of orders) {
        const result = await request.query(`
                    SELECT o.OrderId,
                            o.UserId,
                            od.OrderDetailsId,
                            p.ProductId,
                            p.NameProduct,
                            od.Quantity,
                            od.UnitPrice,
                            od.Discount
                    FROM dbo.OrderDetails as od
                    LEFT JOIN dbo.[Order] as o
                    ON od.OrderId = o.OrderId
                    LEFT JOIN dbo.Product as p
                    ON od.ProductId = p.ProductId
                    WHERE o.OrderId = ${order.OrderId}
                    `) 
                //console.log(orderInfos);
                for (const ce of result.recordset) {
                    order.CartElements.push({
                        UserId: ce.UserId,
                        BasketId: ce.BasketId,
                        BasketDetailsId: ce.BasketDetailsId,
                        ProductId: ce.ProductId,
                        NameProduct: ce.NameProduct,
                        Price: ce.UnitPrice,
                        Discount: ce.Discount,
                        Quantity: ce.Quantity
                    })
                }

        }

    return orders
}

module.exports = ordersRoutes;