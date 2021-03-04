const mongoose = require('mongoose')
const Float = require('mongoose-float').loadType(mongoose);
const {Schema} = mongoose

const bankDepositSchema = new mongoose.Schema({


    user_id:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    amount: {
        type:Float,
        required:true

    }
})
