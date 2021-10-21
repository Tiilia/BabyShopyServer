// link to database
var dbConnect = require("../dbConnect");
// sql object
const sql = require('mssql/msnodesqlv8');


const path = "/users"

const usersRoutes = (app) => {

    // * ---------------------------- GET -------------------------------------
    // READ
    // all users
    app.get(path, function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
            SELECT u.UserId,
                    u.fullName,
                    u.email,
                    u.[password],
                    ur.[Role]
            FROM dbo.[User] as u
            LEFT JOIN dbo.[UserRole] as ur
            ON u.UserRoleId = ur.UserRoleId`,
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

    // user by id
    app.get(`${path}/byId/:id`, function (req, res) {
        let request = new sql.Request(dbConnect);
        request.query(`
            SELECT u.UserId,
                    u.fullName,
                    u.email,
                    u.[password],
                    ur.[Role]
            FROM dbo.[User] as u
            LEFT JOIN dbo.[UserRole] as ur
            ON u.UserRoleId = ur.UserRoleId
            WHERE u.UserId = ${req.params.id}
        `,
            function (error, result, fields) {
                if (error) console.error(error);
                else if (result.length === 0) {
                    result = {
                        reponse: 'error',
                        error: 'invalid id'
                    }
                } else {
                    result = result.recordset[0];
                }
                res.send(result);
            });
    });

    // * ----------------------------------- POST --------------------------------------------
    // CREATE
    app.post(path, (req, res) => {
        let content = req.body;
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

    // * ----------------------------------- UPDATE --------------------------------------------
    // UPDATE user
    // ! need column choice to update
    app.put(`${path}/:id`, (req, res) => {
        let content = req.body;
        console.log(content);
        let request = new sql.Request(dbConnect);
        request.query(`
            UPDATE dbo.[User] as u
            SET UserRoleId = ${content.UserRoleId},
                fullName = N'${content.fullName}',
                email = N'${content.email}',
                password = N'${content.password}'
            WHERE u.UserId = ${req.params.id}
        `, (error, result) => {
            if (error) console.error(error);
            else res.send(result);
        });
    });

    // * ----------------------------------- DELETE --------------------------------------------
    // DELETE user
    // ! need to manage foreign key
    app.delete(`${path}/:id`, (req, res) => {
        let request = new sql.Request(dbConnect);
        request.query(`
            DELETE FROM dbo.[User] as u
            WHERE u.UserId = ${req.params.id}
        `, (error, result) => {
            if (error) console.error(error);
            else res.send(result);
        });
    });
};



module.exports = usersRoutes;