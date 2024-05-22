const User = require('../models/User');
const Income = require('../models/Income');
const Spending = require('../models/Spending');

class ChartService {
  async getChartSpendingInMonth(userId, selectedMonth, selectedYear) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          status: 'ERR',
          message: 'The user is not defined',
        };
      }

      const currentMonthStartDate = new Date(selectedYear, selectedMonth - 1, 1);
      const currentMonthEndDate = new Date(selectedYear, selectedMonth, 0);
      const spendings = await Spending.find({
        _id: { $in: user.spending },
        createdAt: { $gte: currentMonthStartDate, $lt: currentMonthEndDate },
      });

      if (!spendings.length) {
        return {
          status: 'OK',
          message: 'No spendings found for this period.',
          totalAmount: 0,
          categoryAmounts: {},
        };
      }

      const totalAmount = spendings.reduce((acc, spending) => acc + spending.prices, 0);

      const categoryAmounts = spendings.reduce((acc, spending) => {
        const category = spending.action;
        acc[category] = (acc[category] || 0) + spending.prices;
        return acc;
      }, {});

      return {
        status: 'OK',
        message: 'Success',
        totalAmount,
        categoryAmounts,
      };
    } catch (error) {
      return {
        status: 'ERR',
        message: error.message,
      };
    }
  }

  async getChartCompareSpending(userId, selectedMonth, selectedYear) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          status: 'ERR',
          message: 'The user is not defined',
        };
      }

      const currentMonthStartDate = new Date(selectedYear, selectedMonth - 1, 1);
      const currentMonthEndDate = new Date(selectedYear, selectedMonth, 0);

      const previousMonthStartDate = new Date(selectedYear, selectedMonth - 2, 1);
      const previousMonthEndDate = new Date(selectedYear, selectedMonth - 1, 0);

      const currentMonthSpendings = await Spending.find({
        _id: { $in: user.spending },
        createdAt: { $gte: currentMonthStartDate, $lt: currentMonthEndDate },
      });

      const previousMonthSpendings = await Spending.find({
        _id: { $in: user.spending },
        createdAt: { $gte: previousMonthStartDate, $lt: previousMonthEndDate },
      });

      const currentMonthTotal = currentMonthSpendings.reduce((acc, spending) => acc + spending.prices, 0);
      const previousMonthTotal = previousMonthSpendings.reduce((acc, spending) => acc + spending.prices, 0);

      return {
        status: 'OK',
        message: 'Success',
        currentMonthTotal,
        previousMonthTotal,
        difference: currentMonthTotal - previousMonthTotal,
      };
    } catch (error) {
      return {
        status: 'ERR',
        message: error.message,
      };
    }
  }

  async getCompareInMonth(userId, selectedMonth, selectedYear) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          status: 'ERR',
          message: 'The user is not defined',
        };
      }

      const monthStartDate = new Date(selectedYear, selectedMonth - 1, 1);
      const monthEndDate = new Date(selectedYear, selectedMonth, 0);

      const incomes = await Income.find({
        _id: { $in: user.income },
        createdAt: { $gte: monthStartDate, $lt: monthEndDate },
      });

      const spendings = await Spending.find({
        _id: { $in: user.spending },
        createdAt: { $gte: monthStartDate, $lt: monthEndDate },
      });

      const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
      const totalSpending = spendings.reduce((acc, spending) => acc + spending.prices, 0);

      const incomeByCategory = incomes.reduce((acc, income) => {
        const category = income.source;
        acc[category] = (acc[category] || 0) + income.amount;
        return acc;
      }, {});

      const spendingByCategory = spendings.reduce((acc, spending) => {
        const category = spending.action;
        acc[category] = (acc[category] || 0) + spending.prices;
        return acc;
      }, {});

      return {
        status: 'OK',
        message: 'Success',
        totalIncome,
        totalSpending,
        incomeByCategory,
        spendingByCategory,
      };
    } catch (error) {
      return {
        status: 'ERR',
        message: error.message,
      };
    }
  }

  async getChartIncomeInMonth(userId, selectedMonth, selectedYear) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          status: 'ERR',
          message: 'The user is not defined',
        };
      }

      const currentMonthStartDate = new Date(selectedYear, selectedMonth - 1, 1);
      const currentMonthEndDate = new Date(selectedYear, selectedMonth, 0);
      const incomes = await Income.find({
        _id: { $in: user.income },
        createdAt: { $gte: currentMonthStartDate, $lt: currentMonthEndDate },
      });

      if (!incomes.length) {
        return {
          status: 'OK',
          message: 'No incomes found for this period.',
          totalAmount: 0,
          categoryAmounts: {},
        };
      }

      const totalAmount = incomes.reduce((acc, income) => acc + income.amount, 0);

      const categoryAmounts = incomes.reduce((acc, income) => {
        const category = income.source;
        acc[category] = (acc[category] || 0) + income.amount;
        return acc;
      }, {});

      return {
        status: 'OK',
        message: 'Success',
        totalAmount,
        categoryAmounts,
      };
    } catch (error) {
      return {
        status: 'ERR',
        message: error.message,
      };
    }
  }

  async getChartCompareIncome(userId, selectedMonth, selectedYear) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          status: 'ERR',
          message: 'The user is not defined',
        };
      }

      const currentMonthStartDate = new Date(selectedYear, selectedMonth - 1, 1);
      const currentMonthEndDate = new Date(selectedYear, selectedMonth, 0);

      const previousMonthStartDate = new Date(selectedYear, selectedMonth - 2, 1);
      const previousMonthEndDate = new Date(selectedYear, selectedMonth - 1, 0);

      const currentMonthIncomes = await Income.find({
        _id: { $in: user.income },
        createdAt: { $gte: currentMonthStartDate, $lt: currentMonthEndDate },
      });

      const previousMonthIncomes = await Income.find({
        _id: { $in: user.income },
        createdAt: { $gte: previousMonthStartDate, $lt: previousMonthEndDate },
      });

      const currentMonthTotal = currentMonthIncomes.reduce((acc, income) => acc + income.amount, 0);
      const previousMonthTotal = previousMonthIncomes.reduce((acc, income) => acc + income.amount, 0);

      return {
        status: 'OK',
        message: 'Success',
        currentMonthTotal,
        previousMonthTotal,
        difference: currentMonthTotal - previousMonthTotal,
      };
    } catch (error) {
      return {
        status: 'ERR',
        message: error.message,
      };
    }
  }
}

module.exports = new ChartService();
