const mongoose = require('mongoose')
const Float = require('mongoose-float').loadType(mongoose);
const {Schema} = mongoose

const packagesSchema = new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    interest:{
        type:Float
    },
    duration:{
        type:Number,
        defualt:0
    }
})

const Packages = mongoose.model('Packages', packagesSchema)
module.exports = Packages