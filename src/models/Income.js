const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Income = new Schema(
    {
        source: { type: String, required: true }, 
        amount: { type: Number, required: true }, 
        note: { type: String }, 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        createdAt: { type: Date, default: Date.now, required: true } 
    }
);

module.exports = mongoose.model('Income', Income);
