const UserRouter = require('./UserRouter');
const SpendingRouter = require('./SpendingRouter');
const routes = (app) => {
    app.use('/user', UserRouter);
    app.use('/spending', SpendingRouter);
}

module.exports = routes;