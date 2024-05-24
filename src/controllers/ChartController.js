const express = require('express');
const ChartService = require('../services/ChartService');

class ChartController {
  async getChartSpendingInMonth(req, res) {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Please login',
      });
    }
    const selectedMonth = parseInt(req.query.month);
    const selectedYear = parseInt(req.query.year);

    try {
      const response = await ChartService.getChartSpendingInMonth(userId, selectedMonth, selectedYear);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        status: 'ERR',
        message: error.message,
      });
    }
  }

  async getChartCompareSpending(req, res) {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Please login',
      });
    }

    try {
      const { month, year } = req.query;
      const selectedMonth = parseInt(month) || new Date().getMonth() + 1;
      const selectedYear = parseInt(year) || new Date().getFullYear();

      const response = await ChartService.getChartCompareSpending(userId, selectedMonth, selectedYear);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        status: 'ERR',
        message: error.message,
      });
    }
  }

  async getCompareInMonth(req, res) {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Please login',
      });
    }

    try {
      const { month, year } = req.query;
      const selectedMonth = parseInt(month) || new Date().getMonth() + 1;
      const selectedYear = parseInt(year) || new Date().getFullYear();
      const response = await ChartService.getCompareInMonth(userId, selectedMonth, selectedYear);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        status: 'ERR',
        message: error.message,
      });
    }
  }

  async getChartIncomeInMonth(req, res) {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Please login',
      });
    }
    const selectedMonth = parseInt(req.query.month);
    const selectedYear = parseInt(req.query.year);

    try {
      const response = await ChartService.getChartIncomeInMonth(userId, selectedMonth, selectedYear);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        status: 'ERR',
        message: error.message,
      });
    }
  }

  async getChartCompareIncome(req, res) {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Please login',
      });
    }

    try {
      const { month, year } = req.query;
      const selectedMonth = parseInt(month) || new Date().getMonth() + 1;
      const selectedYear = parseInt(year) || new Date().getFullYear();

      const response = await ChartService.getChartCompareIncome(userId, selectedMonth, selectedYear);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        status: 'ERR',
        message: error.message,
      });
    }
  }
}

module.exports = new ChartController();
