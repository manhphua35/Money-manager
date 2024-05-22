const UserRouter = require('./UserRouter');
const SpendingRouter = require('./SpendingRouter');
const IncomeRouter = require('./IncomeRouter');
const ChartRouter = require('./ChartRouter');
const routes = (app) => {
    app.use('/user', UserRouter);
    app.use('/spending', SpendingRouter);
    app.use('/income', IncomeRouter);
    app.use('/chart', ChartRouter)
}

module.exports = routes;