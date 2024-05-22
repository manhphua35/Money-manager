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
                createdAt : time
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

    async deleteIncome(incomeId, userId){
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

    async getIncomeInMonth(userId, selectMonth, selectYear, page, limit) {
        try {
          const user = await User.findById({ _id: userId });
          if (!user) {
            return {
              status: 'ERR',
              message: 'The user is not defined',
            };
          }
      
          const skip = (page - 1) * limit;
      
          // Tính tổng thu nhập theo ngày mà không phân trang
          const totalIncomePerDay = await Income.aggregate([
            {
              $match: {
                _id: { $in: user.income },
                createdAt: {
                  $gte: new Date(selectYear, selectMonth - 1, 1),
                  $lte: new Date(selectYear, selectMonth, 0),
                },
              },
            },
            {
              $group: {
                _id: {
                  day: { $dayOfMonth: "$createdAt" },
                  month: { $month: "$createdAt" },
                  year: { $year: "$createdAt" },
                },
                totalEarned: { $sum: "$amount" },
              },
            },
          ]);
      
          // Lấy các hoạt động thu nhập có phân trang
          const incomeInMonth = await Income.aggregate([
            {
              $match: {
                _id: { $in: user.income },
                createdAt: {
                  $gte: new Date(selectYear, selectMonth - 1, 1),
                  $lte: new Date(selectYear, selectMonth, 0),
                },
              },
            },
            {
              $sort: { createdAt: -1 }, // Sort by date in descending order
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $group: {
                _id: {
                  day: { $dayOfMonth: "$createdAt" },
                  month: { $month: "$createdAt" },
                  year: { $year: "$createdAt" },
                },
                incomes: { $push: "$$ROOT" },
              },
            },
            {
              $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 }, // Sort groups in descending order
            },
          ]);
      
          const total = await Income.countDocuments({
            _id: { $in: user.income },
            createdAt: {
              $gte: new Date(selectYear, selectMonth - 1, 1),
              $lte: new Date(selectYear, selectMonth, 0),
            },
          });
      
          // Kết hợp tổng thu nhập theo ngày vào kết quả thu nhập có phân trang
          const incomeWithTotal = incomeInMonth.map(dayIncome => {
            const totalEarnedDay = totalIncomePerDay.find(day => 
              day._id.day === dayIncome._id.day &&
              day._id.month === dayIncome._id.month &&
              day._id.year === dayIncome._id.year
            );
            return {
              ...dayIncome,
              totalEarned: totalEarnedDay ? totalEarnedDay.totalEarned : 0,
            };
          });
      
          return {
            status: 'OK',
            message: 'SUCCESS',
            data: incomeWithTotal,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
          };
        } catch (error) {
          return {
            status: 'ERR',
            message: error.message,
          };
        }
      }
      
      
      async getStaticsInMonth(userId, selectedMonth, selectedYear) {
        if (!userId) {
          return {
            status: "ERR",
            message: "The user is not defined"
          }
        }
        try {
          const user = await User.findById({ _id: userId });
          if (!user) {
            return {
              status: "ERR",
              message: "Can not find the user"
            }
          }
          const currentMonthStartDate = new Date(selectedYear, selectedMonth - 1, 1);
          const currentMonthEndDate = new Date(selectedYear, selectedMonth, 0);
      
          const incomes = await Income.find({
            _id: { $in: user.income },
            createdAt: { $gte: currentMonthStartDate, $lt: currentMonthEndDate }
          });
      
          const summary = incomes.reduce((acc, income) => {
            const category = income.source;
            acc[category] = (acc[category] || 0) + income.amount;
            return acc;
          }, {});
      
          let maxIncome = { amount: 0, source: null, time: null };
          incomes.forEach(income => {
            if (income.amount > maxIncome.amount) {
              maxIncome = { 
                amount: income.amount, 
                source: income.source,
                time: income.createdAt 
              };
            }
          });
      
          let maxCategory = { category: null, total: 0 };
          for (const [category, total] of Object.entries(summary)) {
            if (total > maxCategory.total) {
              maxCategory = { category, total };
            }
          }
      
          const currentMonthTotal = incomes.reduce((acc, income) => acc + income.amount, 0);
      
          const previousMonthStartDate = selectedMonth === 1 ? new Date(selectedYear - 1, 11, 1) : new Date(selectedYear, selectedMonth - 2, 1);
          const previousMonthEndDate = new Date(selectedYear, selectedMonth - 1, 0);
      
          const previousMonthCourses = await Income.find({
            _id: { $in: user.income },
            createdAt: { $gte: previousMonthStartDate, $lt: previousMonthEndDate }
          });
      
          let previousmaxIncome = { amount: 0, source: null, time: null };
      
          previousMonthCourses.forEach(income => {
            if (income.amount > previousmaxIncome.amount) {
              previousmaxIncome = { 
                amount: income.amount, 
                source: income.source,
                time: income.createdAt 
              };
            }    
          });
      
          const previousMonthSummary = previousMonthCourses.reduce((acc, income) => {
            const category = income.source;
            acc[category] = (acc[category] || 0) + income.amount;
            return acc;
          }, {});
      
          let previousmaxCategory = { category: null, total: 0 };
          for (const [category, total] of Object.entries(previousMonthSummary)) {
            if (total > previousmaxCategory.total) {
              previousmaxCategory = { category, total };
            }
          }
      
          const previousMonthTotal = previousMonthCourses.reduce((acc, income) => acc + income.amount, 0);
          const difference = currentMonthTotal - previousMonthTotal;
      
          return({
            status: "OK",
            message: "SUCCESS",
            currentMonth: {
              month: selectedMonth,
              year: selectedYear,
              summary,
              maxIncome,
              maxCategory,
              total: currentMonthTotal
            },
            previousMonth: {
              month: selectedMonth === 1 ? 12 : selectedMonth - 1,
              year: selectedMonth === 1 ? selectedYear - 1 : selectedYear,
              summary: previousMonthSummary,
              previousmaxIncome,
              previousmaxCategory,
              total: previousMonthTotal
            },
            difference
          });
        } catch (error) {
          console.error('Error:', error);
          return {
            status: "ERR",
            message: "Internal Server Error"
          }
        }
      }
      
      
      async getchart(userId, selectedMonth, selectedYear) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    status: 'ERR',
                    message: 'The user is not defined'
                };
            }
    
            const currentMonthStartDate = new Date(selectedYear, selectedMonth - 1, 1); // Month is 0-indexed
            const currentMonthEndDate = new Date(selectedYear, selectedMonth, 0);
            const incomes = await Income.find({
                _id: { $in: user.income },
                createdAt: { $gte: currentMonthStartDate, $lt: currentMonthEndDate }
            });
            if (!incomes.length) {
                return {
                    status: 'OK',
                    message: 'No spendings found for this period.',
                    summary: {}
                };
            }
    
            const summary = incomes.reduce((acc, income) => {
                const category = income.source;
                acc[category] = (acc[category] || 0) + income.amount;
                return acc;
            }, {});
    
            const total = incomes.reduce((acc, income) => acc + income.amount, 0);
    
            const percentages = Object.fromEntries(
                Object.entries(summary).map(([action, amount]) => [
                    action,
                    ((amount / total) * 100).toFixed(2) // Format to 2 decimal places
                ])
            );
    
            return {
                status: 'OK',
                message: 'Success',
                summary,
                percentages,
                total
            };
        } catch (error) {
            return {
                status: 'ERR',
                message: error.message
            };
        }
    }
    
}

module.exports = new IncomeService()