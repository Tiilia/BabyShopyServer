var jwt = require('jsonwebtoken');
// var bcrypt = require('bcryptjs');
// var md5 = require('md5');

// link to database
var dbConnect = require("../dbConnect");
// sql object
const sql = require('mssql/msnodesqlv8');


const path = "/auth"

const authRoutes = (app) => {

    // DOC
    // https://akveo.github.io/nebular/docs/auth/backend-api-endpoints#backend-auth-endpoints
    // https://nodejs.org/api/readline.html => readline nodejs..


    // ? ---------------------------- LOGIN -------------------------------------
    app.post(`${path}/sign-in`, async function (req, res) {
        let {
            email,
            password
        } = req.body;

        console.log("ok")

        let request = new sql.Request(dbConnect);
        request.query(`
            SELECT  u.email,
                    u.fullName,
                    u.registerDate,
                    u.UserId,
                    ur.[Role],
                    b.BasketId
            FROM dbo.[User] as u
            LEFT JOIN dbo.UserRole as ur
            ON ur.UserRoleId = u.UserRoleId
            LEFT JOIN dbo.Basket as b
            ON b.UserId = u.UserId
            WHERE u.email = '${email}' and u.password = HASHBYTES ('SHA2_256', N'${password}')
            `,
            (error, result, fields) => {
                if (error) console.error(error);
                else {
                    console.log(result)
                    let token = jwt.sign({
                        data: result.recordset[0]
                    }, 'secret', {
                        expiresIn: 120 * 60
                      })
                    console.log(result.recordset[0])
                    console.log(token)
                    res.send({
                        "token": token
                    })
                }
            })
    });

    // ? ---------------------------- SIGN-UP -------------------------------------
    app.post(`${path}/sign-up`, (req, res) => {
        let content = req.body;
        console.log("ok")
        console.log(content);

        let request = new sql.Request(dbConnect);

        // check if user already exist
        // Validate if user exist in our database
        // request.query(`
        //     SELECT u.email
        //     FROM do.[User] as u
        //     WHERE u.email = ${content.email}
        // `, (error, result) => {
        //     if (result) res.status(409).send("User Already Exist. Please Login");
        // })

        // Create user in database
        // output inserted.email, inserted.fullName, '*******' as password 
        request.query(`
            INSERT INTO dbo.[User] 
            output  inserted.email, 
                    inserted.fullName, 
                    inserted.registerDate,
                    inserted.UserId as userId,
                    'user' as Role
            VALUES(
                2,
                N'${content.fullName}',
                N'${content.email}',
                HASHBYTES ('SHA2_256', N'${content.password}'),
                GETDATE()
            )
            INSERT INTO dbo.Basket
            output inserted.BasketId
            VALUES (
                (SELECT max(UserId) FROM [User])
            )`,
            (error, result) => {
                if (error) console.error(error);
                else {
                    // Create token
                    let token = jwt.sign({
                        data: result.recordset[0]
                    }, 'secret', {
                        expiresIn: 120 * 60
                      })
                    console.log(token);
                    res.send({
                        "token": token
                    })
                }
            });



        // save user token
        //request.query

        // return new user
        // res.status(201)
    });

    // ? ---------------------------- LOGOUT -------------------------------------
    app.post(`${path}/sign-out`, (req, res) => {
       res.send({ token: ""})
    })


    // ? ---------------------------- REQUEST PASS-------------------------------------
    // ? ---------------------------- RESET PASS -------------------------------------






}
module.exports = authRoutes;