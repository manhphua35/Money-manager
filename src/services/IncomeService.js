const User = require('../models/User');
const Income = require('../models/Income');

class IncomeService{
    async createIncome(userId,data){
        const {source, amount, note, time} = data;
        try {
            const user = await User.findOne({_id : userId});
            if(!user){
                return ({
                    status : 'ERR',
                    message : 'The user is not defined'
                })
            }
            const newIncome = new Income({
                source,
                amount,
                note,
                user : user.id,
                time
            })
            await newIncome.save();
            await user.income.push(newIncome._id);
            await user.save();
            return ({
                status : 'OK',
                message : 'SUCCESS',
                data : newIncome
            })
        }catch(error){
            console.log(error)
            reject : error.message
        }
    }

    async updateIncome(incomeId,data){
        try {
            const income = await Income.findOne({_id : incomeId});
            if(!income){
                return ({
                    status : 'ERR',
                    message : 'The income is not defined'
                })
            }
            const updatedIncome = await Income.findByIdAndUpdate({_id : incomeId},data,{new : true});
            return ({
                status : 'OK',
                message : 'SUCCESS',
                data : updatedIncome
            })
        }catch(error){
            reject : error.message
        }
    }

    async deleteIncome(incomeId){
        try {
            await Income.findOneAndDelete({_id : incomeId});
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

module.exports = new IncomeService()