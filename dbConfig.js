var dbConfig = {
    server: "localhost",
    // port: 1433,
    database: "BabyShopy",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
}
module.exports = dbConfig;