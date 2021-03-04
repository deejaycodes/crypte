const mongoose = require('mongoose');
const {Schema} = mongoose
const Float = require('mongoose-float').loadType(mongoose);

const investmentSchema = mongoose.Schema({
    package_id:{
        type: Schema.Types.ObjectId,
        ref:'package'
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    amount:{
        type:Float,
        default:0,

    },
    interest:{
        type:Float,
        default:0
    },
    expiredAt:{
        type:Date,
        default:Date.now

    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Investment = mongoose.model('Investment', investmentSchema)
module.exports = Investment