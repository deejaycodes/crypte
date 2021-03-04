// package imports
const moment = require("moment");

// local imports


const User  = require('../models/User')
const Packages = require('../models/Packages')
const Investments = require('../models/Investments')
const Chats =require('../models/Chat');
const Investments = require("../models/Investments");

class HomeController{
    async home(req,res){
        const unansweredChats = await Chats.find({receiver_id:req.user._id, read_status:0})
        if(req.user.isAdmin === false){
            try {
                const user = await User.findOne({_id:req.user._id})
        console.log(user)
       const userInvestments = await Investments.find({ user_id:req.session.userId , expiredAt:{$gte: moment().format('YYYY-MM-DD HH:mm:ss')}} )
       console.log(userInvestments)
       res.render("dashboards/users/user_home", {
        user: user,
        wallet: user.wallet,
        investment: investment.length,
        messages: unansweredChats
    });
                
            } catch (error) {
                console.log(error)
            }
        }
        
       

    }
}

const homeController = new HomeController();
module.exports = homeController