const cookieParser = require('cookie-parser');
const express = require('express');
const SpendingService = require('../services/SpendingService');
const mongoose = require('mongoose');
const app = express();
app.use(cookieParser());

class SpendingController{
    async createSpending(req,res){
       try {
            const userId = req.cookies.userId;
            if(!userId){
                res.status(400).json({
                    status: 'ERR',
                    message: 'Please login'
                })
            }
            const response = await SpendingService.createSpending(userId, req.body);
            return res.status(200).json(response);
       } catch (error) {
            res.status(400).json({
                status: 'ERR',
                message: error.message
            })
       }
    }

    async updateSpending(req,res){
        const {action, prices, note, createdAt} = req.body;
        const spendingId = req.params.id;
        try {
            if(!action || !prices || !createdAt){
                res.status(400).json({
                    status: 'ERR',
                    message: 'Please login'
                })
            }
            const response = await SpendingService.updateSpending(spendingId,req.body);
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({
                status: 'ERR',
                message: error.message
            })
        }
    }

    async deleteSpending(req,res){
        const spendingId = req.params.id;
        const userId = req.cookies.userId;
        if(!userId){
            res.status(400).json({
                status: 'ERR',
                message: 'Please login'
            })
        }
        try {
            const response = await SpendingService.deleteSpending(userId, spendingId);
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({
                status: 'ERR',
                message: error.message
            })
        }
    }
    
    async getSpendingInMonth(req, res) {
        const userId = req.cookies.userId;
        const selectMonth = parseInt(req.query.month);
        const selectYear = parseInt(req.query.year);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        try {
          const response = await SpendingService.getSpendingInMonth(userId, selectMonth, selectYear, page, limit);
          return res.status(200).json(response);
        } catch (error) {
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
            const response = await SpendingService.getStaticsInMonth(userId,selectMonth,selectYear)
            return res.status(200).json(response);
        } catch (error) {
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
            const response = await SpendingService.getchart(userId, selectedMonth, selectedYear);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(400).json({
                status: 'ERR',
                message: error.message
            });
        }
    }
    

}

module.exports = new SpendingController();