const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Spending = new Schema(
    {
        action : {type : String, require : true},
        prices : {type : Number, require : true},
        note : {type: String},
        user : {type : Schema.Types.ObjectId, ref : 'User'},
        time : {type : Date, default : Date.now, require : true}
    }
)

module.exports = mongoose.model('Spending', Spending)