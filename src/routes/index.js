const UserRouter = require('./UserRouter');
const SpendingRouter = require('./SpendingRouter');
const IncomeRouter = require('./IncomeRouter');
const routes = (app) => {
    app.use('/user', UserRouter);
    app.use('/spending', SpendingRouter);
    app.use('/income', IncomeRouter);
}

module.exports = routes;