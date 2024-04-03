const express = require('express');
const SpendingService = require('../services/SpendingService');

class SpendingController{
    async createSpending(req,res){
       try {
            const userId = req.cookies.userId;
            console.log(userId)
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
        const {action, prices, note, time} = req.body;
        const spendingId = req.params.id;
        try {
            if(!action || !prices || !time){
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
        try {
            const response = await SpendingService.deleteSpending(spendingId);
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({
                status: 'ERR',
                message: error.message
            })
        }
    }

    

}

module.exports = new SpendingController();