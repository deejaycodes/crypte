const mongoose = require('mongoose')
const {Schema} = mongoose

const walletSchema = new mongoose.Schema({
    deposit:{
        type:String,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    revenue:{
        type:String,
    },
    withdrawal:{
        type:String
    }
})


const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet