const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Spending = new Schema(
    {
        action : {type : String, required : true},
        prices : {type : Number, required : true},
        note : {type: String},
        user : {type : Schema.Types.ObjectId, ref : 'User'},
        createdAt : {type : Date, default : Date.now, required : true}
    }
)

module.exports = mongoose.model('Spending', Spending)