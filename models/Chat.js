const mongoose = require('mongoose')
const {Schema} = mongoose
const chatSchema = mongoose.Schema({
sender_id:{
    type:Schema.Types.ObjectId,
    ref:'user'
},
receiver_id:{
    type:Schema.Types.ObjectId,
    
},
message:{
    type:String,
    required:true,
    trim:true

},
read_status:{
    type:Number,


},
createdAt:{
type: Date,
default: Date.now
}
})

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat