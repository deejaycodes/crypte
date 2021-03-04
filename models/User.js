const mongoose = require('mongoose');
const validator = require('validator')
const Float = require('mongoose-float').loadType(mongoose);
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }

    },
    phone:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    wallet:{
        type:Float
    },
    referral_count:{
        type:String,
    },
    referral_amount:{
        type:Float,
        default:0

    },
    password:{
        type:String,
        required:true
    },
    reference:{
        type:String,
    },
    referral_id:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()

    },
    

},{
    timestamps:true
})





const User = mongoose.model('User', userSchema)
module.exports= User