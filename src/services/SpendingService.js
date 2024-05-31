const User = require('../models/User');
const Spending = require('../models/Spending');
const XLSX = require('xlsx');


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
                createdAt : time
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
            // console.log(spendingId)
            // console.log(data)
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

    async deleteSpending(userId,spendingId){
        try {
            await Spending.findOneAndDelete({_id : spendingId});
            await User.updateOne(
                {_id: userId},
                {$pull: {spending: spendingId}}
            )
            return ({
                status : 'OK',
                message : 'SUCCESS'
            })
        } catch (error) {
            reject(error.message);
        }
    }

    async getSpendingInMonth(userId, selectMonth, selectYear, page, limit) {
      try {
        const user = await User.findById(userId);
        if (!user) {
          return {
            status: 'ERR',
            message: 'The user is not defined',
          };
        }
    
        const skip = (page - 1) * limit;
    
        // Thiết lập startDate và endDate bao phủ toàn bộ tháng
        const startDate = new Date(Date.UTC(selectYear, selectMonth - 1, 1));
        const endDate = new Date(Date.UTC(selectYear, selectMonth, 0, 23, 59, 59, 999));
    
        // Tính tổng chi tiêu theo ngày mà không phân trang
        const totalSpendingPerDay = await Spending.aggregate([
          {
            $match: {
              _id: { $in: user.spending },
              createdAt: {
                $gte: startDate,
                $lt: endDate,
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
              totalSpent: { $sum: "$prices" },
            },
          },
        ]);
    
        // Lấy các hoạt động chi tiêu có phân trang
        const spendingInMonth = await Spending.aggregate([
          {
            $match: {
              _id: { $in: user.spending },
              createdAt: {
                $gte: startDate,
                $lt: endDate,
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
              activities: { $push: "$$ROOT" },
            },
          },
          {
            $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 }, // Sort groups in descending order
          },
        ]);
    
        const total = await Spending.countDocuments({
          _id: { $in: user.spending },
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        });
    
        // Kết hợp tổng chi tiêu theo ngày vào kết quả chi tiêu có phân trang
        const spendingWithTotal = spendingInMonth.map(daySpending => {
          const totalSpentDay = totalSpendingPerDay.find(day => 
            day._id.day === daySpending._id.day &&
            day._id.month === daySpending._id.month &&
            day._id.year === daySpending._id.year
          );
          return {
            ...daySpending,
            totalSpent: totalSpentDay ? totalSpentDay.totalSpent : 0,
          };
        });
    
        return {
          status: 'OK',
          message: 'SUCCESS',
          data: spendingWithTotal,
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
      
           

    async getStaticsInMonth(userId,selectedMonth,selectedYear){
      if (!userId) {
        return {
          status: "ERR",
          message: "The user is not defined"
        };
      }
      try {
        const user = await User.findById(userId);
        if (!user) {
          return {
            status: "ERR",
            message: "Can not find the user"
          };
        }
    
        // Thiết lập startDate và endDate bao phủ toàn bộ tháng hiện tại
        const currentMonthStartDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
        const currentMonthEndDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));
    
        const spendings = await Spending.find({
          _id: { $in: user.spending },
          createdAt: { $gte: currentMonthStartDate, $lt: currentMonthEndDate }
        });
    
        const summary = spendings.reduce((acc, spending) => {
          const category = spending.action;
          acc[category] = (acc[category] || 0) + spending.prices;
          return acc;
        }, {});
    
        let maxExpense = { amount: 0, activity: null, time: null };
        spendings.forEach(spending => {
          if (spending.prices > maxExpense.amount) {
            maxExpense = { 
              amount: spending.prices, 
              activity: spending.action,
              time: spending.createdAt 
            };
          }
        });
    
        let maxCategory = { category: null, total: 0 };
        for (const [category, total] of Object.entries(summary)) {
          if (total > maxCategory.total) {
            maxCategory = { category, total };
          }
        }
    
        const currentMonthTotal = spendings.reduce((acc, spending) => acc + spending.prices, 0);
    
        // Thiết lập startDate và endDate bao phủ toàn bộ tháng trước
        const previousMonthStartDate = new Date(Date.UTC(selectedYear, selectedMonth - 2, 1));
        const previousMonthEndDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 0, 23, 59, 59, 999));
    
        const previousMonthCourses = await Spending.find({
          _id: { $in: user.spending },
          createdAt: { $gte: previousMonthStartDate, $lt: previousMonthEndDate }
        });
    
        let previousmaxExpense = { amount: 0, activity: null, time: null };
    
        previousMonthCourses.forEach(spending => {
          if (spending.prices > previousmaxExpense.amount) {
            previousmaxExpense = { 
              amount: spending.prices, 
              activity: spending.action,
              time: spending.createdAt 
            };
          }    
        });
    
        const previousMonthSummary = previousMonthCourses.reduce((acc, spending) => {
          const category = spending.action;
          acc[category] = (acc[category] || 0) + spending.prices;
          return acc;
        }, {});
    
        let previousmaxCategory = { category: null, total: 0 };
        for (const [category, total] of Object.entries(previousMonthSummary)) {
          if (total > previousmaxCategory.total) {
            previousmaxCategory = { category, total };
          }
        }
    
        const previousMonthTotal = previousMonthCourses.reduce((acc, spending) => acc + spending.prices, 0);
        const difference = currentMonthTotal - previousMonthTotal;
    
        return {
          status: "OK",
          message: "SUCCESS",
          currentMonth: {
            month: selectedMonth,
            year: selectedYear,
            summary,
            maxExpense,
            maxCategory,
            total: currentMonthTotal
          },
          previousMonth: {
            month: selectedMonth === 1 ? 12 : selectedMonth - 1,
            year: selectedMonth === 1 ? selectedYear - 1 : selectedYear,
            summary: previousMonthSummary,
            previousmaxExpense,
            previousmaxCategory,
            total: previousMonthTotal
          },
          difference
        };
      } catch (error) {
        console.error('Error:', error);
        return {
          status: "ERR",
          message: "Internal Server Error"
        };
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
    
        // Thiết lập startDate và endDate bao phủ toàn bộ tháng hiện tại
        const currentMonthStartDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1));
        const currentMonthEndDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999));
    
        const spendings = await Spending.find({
          _id: { $in: user.spending },
          createdAt: { $gte: currentMonthStartDate, $lt: currentMonthEndDate }
        });
    
        if (!spendings.length) {
          return {
            status: 'OK',
            message: 'No spendings found for this period.',
            summary: {}
          };
        }
    
        const summary = spendings.reduce((acc, spending) => {
          const category = spending.action;
          acc[category] = (acc[category] || 0) + spending.prices;
          return acc;
        }, {});
    
        const total = spendings.reduce((acc, spending) => acc + spending.prices, 0);
    
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
  
  async getReport(month, year) {
        // Thiết lập startDate và endDate bao phủ toàn bộ tháng
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      const spendings = await Spending.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      const ws_data = [
        ['Hoạt động', 'Số tiền', 'Ghi chú', 'Ngày tạo'],
        ...spendings.map(spending => [
          spending.action,
          spending.prices,
          spending.note,
          spending.createdAt.toISOString().split('T')[0],
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(ws_data);

      const colWidths = ws_data[0].map((_, colIndex) => {
        const maxLength = Math.max(
          ...ws_data.map(row => (row[colIndex] ? row[colIndex].toString().length : 0))
        );
        return { wch: maxLength + 2 };
      });

      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Spending Report');

      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      return buffer;
  };
  
    
}

module.exports = new SpendingService();