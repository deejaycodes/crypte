const mongoose = require('mongoose')
const {Schema} = mongoose
const referralSchema = mongoose.Schema({
    referal_id:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

const Referral = mongoose.model('Referral', referralSchema)
module.exports = Referral
