const express = require('express');
const IncomeService = require('../services/IncomeService');

class IncomeController{
    async createIncome(req, res) {
        try {
            const userId = req.cookies.userId;
            const { source, amount, time } = req.body;
            if (!source || !amount || !time) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Please fill the information'
                });
            }
            if (!userId) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'Please login'
                });
            }
            const response = await IncomeService.createIncome(userId, req.body);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }
    

    async updateIncome(req,res){
        const {source, amount, note, createdAt} = req.body;
        const incomeId = req.params.id;
        try {
            if(!source || !amount || !createdAt){
                res.status(400).json({
                    status: 'ERR',
                    message: 'Please fill the information'
                })
            }
            const response = await IncomeService.updateIncome(incomeId,req.body);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }
    
    async deleteIncome(req,res){
        const incomeId = req.params.id;
        const userId = req.cookies.userId;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Please login'
            });
        }
        try {
            const response = await IncomeService.deleteIncome(incomeId, userId);
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({
                status: 'ERR',
                message: error.message
            })
        }
    }

    async getIncomeInMonth(req, res) {
        const userId = req.cookies.userId;
        const selectMonth = parseInt(req.query.month);
        const selectYear = parseInt(req.query.year);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        try {
          const response = await IncomeService.getIncomeInMonth(userId, selectMonth, selectYear, page, limit);
          return res.status(200).json(response);
        } catch (error) {
            console.log(error.message)
          res.status(400).json({
            status: 'ERR',
            message: error.message
          });
        }
      }
      

    async getStaticsInMonth(req,res){
        const userId = req.cookies.userId;
        const selectMonth = parseInt(req.query.month);
        const selectYear = parseInt(req.query.year);
        try {
            const response = await IncomeService.getStaticsInMonth(userId,selectMonth,selectYear)
            //console.log(response)
            return res.status(200).json(response);
        } catch (error) {
            console.log(error.message)
            res.status(400).json({
                status: 'ERR',
                message: error.message
            })
        }
    }

    async getchart(req, res) {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Please login'
            });
        }
        const selectedMonth = parseInt(req.query.month);
        const selectedYear = parseInt(req.query.year);
        try {
            const response = await IncomeService.getchart(userId, selectedMonth, selectedYear);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(400).json({
                status: 'ERR',
                message: error.message
            });
        }
    }
    
    async getReport(req,res){
        try {
            const { month, year } = req.query;
            const buffer = await IncomeService.getReport(parseInt(month), parseInt(year));
            res.setHeader('Content-Disposition', `attachment; filename=Income_Report_${month}_${year}.xlsx`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    }
}
module.exports = new IncomeController();