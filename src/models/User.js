const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
    {
    name : {type : String, require: true},
    email : {type: String, require : true, unique : true},
    password : {type : String, require : true},
    phone : {type : String, require : true},
    spending : [{type : Schema.Types.ObjectId, ref : 'Spendings'}],
    income_stream : [{type : Schema.Types.ObjectId, ref : 'Income-Streams'}]
    },
    {
        timestamps : true, 
        collection : "Users"
    }
);

module.exports = mongoose.model('User', User)