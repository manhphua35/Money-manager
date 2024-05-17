const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
    {
    name : {type : String, required: true},
    email : {type: String, required : true, unique : true},
    password : {type : String, required : true},
    phone : {type : String, required : true},
    spending : [{type : Schema.Types.ObjectId, ref : 'Spendings'}],
    income : [{type : Schema.Types.ObjectId, ref : 'Incomes'}]
    },
    {
        timestamps : true, 
        collection : "Users"
    }
);

module.exports = mongoose.model('User', User)