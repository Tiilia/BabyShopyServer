// routes declarations



const appRouter = (app) => {

    app.get('/', (req, res) => {
        res.send(`
        Welcome to the BabyShopy api-server! 
        Routes: 
        `);
    });




};
module.exports = appRouter;