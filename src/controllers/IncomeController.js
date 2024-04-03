const express = require('express');
const IncomeService = require('../services/IncomeService');

class IncomeController{
    async createIncome(req,res){
        try {
            const userId = req.cookies.userId;
            const {source, amount, note, time} = req.body;
            if(!source || !amount || !time){
                res.status(400).json({
                    status: 'ERR',
                    message: 'Please fill the information'
                })
            }
            if(!userId){
                res.status(400).json({
                    status: 'ERR',
                    message: 'Please login'
                })
            }
            const response = await IncomeService.createIncome(userId,req.body);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    async updateIncome(req,res){
        const {source, amount, note, time} = req.body;
        const incomeId = req.params.id;
        try {
            if(!source || !amount || !time){
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
        try {
            const response = await IncomeService.deleteIncome(incomeId);
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({
                status: 'ERR',
                message: error.message
            })
        }
    }
}
module.exports = new IncomeController();