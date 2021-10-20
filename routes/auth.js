// link to database
var dbConnect = require("../dbConnect");
// sql object
const sql = require('mssql/msnodesqlv8');


const path = "/auth"

const authRoutes = (app) => {

// DOC
// https://akveo.github.io/nebular/docs/auth/backend-api-endpoints#backend-auth-endpoints


    // ? ---------------------------- LOGIN -------------------------------------
    app.post(`${path}/sign-in`, (req, res) => {
        let content = req.body;
        console.log("ok")
        console.log(content);
        let request = new sql.Request(dbConnect);
        request.query(`
            SELECT u.Mail as email,
                   u.[Password] as password,
            FROM do.[User] as u
        `,
            (error, result) => {
                if (error) console.error(error);
                else res.send(result);
            });
    });

    // ? ---------------------------- SIGN-UP -------------------------------------
    app.post(`${path}/sign-up`, (req, res) => {
        let content = req.body;
        console.log("ok")
        console.log(content);
        let request = new sql.Request(dbConnect);
        request.query(`
            INSERT INTO dbo.[User] 
            VALUES(
                2,
                N'${content.fullName}',
                N'${content.email}',
                N'${content.password}'
    )`,
            (error, result) => {
                if (error) console.error(error);
                else res.send(result);
            });
    });

    // ? ---------------------------- REQUEST PASS-------------------------------------
    // ? ---------------------------- RESET PASS -------------------------------------
    // ? ---------------------------- RESET PASS -------------------------------------



    
    
}
module.exports = authRoutes;