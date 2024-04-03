const User = require('../models/User');
const Spending = require('../models/Spending');

class SpendingService {
    async createSpending(userId,data){
        const {action, prices, note, time} = data;
        try {
            const user = await User.findOne({_id : userId });
            if(!user){
                return ({
                    status : 'ERR',
                    message : 'The user is not defined'
                })
            }
            const newSpending = new Spending({
                action,
                prices,
                note,
                user : user.id,
                time
            })
            await newSpending.save();
            user.spending.push(newSpending.id);
            await user.save();
            return ({
                status : 'OK',
                message : 'SUCCESS',
                data : newSpending
            })
        } catch (error) {
            reject : error.message
        }
    }

    async updateSpending(spendingId,data){
        try {
            const checkSpending = await Spending.findOne({
                _id: spendingId
            })
            if (checkSpending === null) {
                return({
                    status: 'ERR',
                    message: 'The Spending is not defined'
                })
            }
            const spending = await Spending.findByIdAndUpdate({_id : spendingId},data,{new : true});
            return ({
                status : 'OK',
                message : 'SUCCESS',
                data : spending
            })
        } catch (error) {
            reject(error.message);
        }
    }

    async deleteSpending(spendingId){
        try {
            await Spending.findOneAndDelete({_id : spendingId});
            await User.updateOne(
                {_id: userId},
                {$pull: {income: incomeId}}
            )
            
            return ({
                status : 'OK',
                message : 'SUCCESS'
            })
        } catch (error) {
            reject(error.message);
        }
    }
}

module.exports = new SpendingService();