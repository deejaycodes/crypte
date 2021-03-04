// package imports
const moment = require("moment");

// local imports

const Referrals = require('../models/Referral')
const User  = require('../models/User')
const Packages = require('../models/Packages')
const Investments = require('../models/Investments')
const Chats =require('../models/Chat');
const Investment = require("../models/Investments");

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


exports.home = (req, res, next) => {
    Chats.find({ receiver_id: req.session.userId, read_status:0  })
        .then(unansweredChats => {
            if (req.session.role == 2 || req.session.role == "2" || req.session.role == 3 || req.session.role == "3") {

                // get user wallet, referral count, total investment, active investment, kyc
                User.findOne({id: req.session.userId })
                    .then(user => {
                        if (user) {
                            console.log(user)
                            Referrals.find({ referral_id:  req.session.userId })
                            .then(referral => {
                                Investments.find({user_id: req.session.userId})
                                    .then(investment => {
                                        Investments({ user_id:req.session.userId , expiredAt:{$gte: moment().format('YYYY-MM-DD HH:mm:ss')}} )
                                            .then(activeInvestments => {
                                                Kycs.findOne({user_id: req.session.userId})
                                                    .then(kyc => {
                                                        if (kyc) {
                                                            res.render("dashboards/users/user_home", {
                                                                user: user,
                                                                kyc: kyc.status,
                                                                wallet: user.wallet,
                                                                referral: referral.length,
                                                                investment: investment.length,
                                                                active_investment: activeInvestments.length,
                                                                messages: unansweredChats
                                                            });
                                                        } else {
                                                            res.render("dashboards/users/user_home", {
                                                                user: user,
                                                                kyc: 0,
                                                                wallet: user.wallet,
                                                                referral: referral.length,
                                                                referral_amount: referral.length * 1000,
                                                                investment: investment.length,
                                                                active_investment: activeInvestments.length,
                                                                messages: unansweredChats
                                                            });
                                                        }
                                                    })
                                                    .catch(error => {
                                                        res.redirect("/");
                                                    });
                                            })
                                            .catch(error => {
                                                res.redirect("/");
                                            });
                                    })
                                    .catch(error => {
                                        res.redirect("/");
                                    });
                            }).catch(error => {
                                res.redirect("/");
                            });

                        } else {
                            res.redirect("/");
                        }
                    })
                    .catch(error => {
                        res.redirect("/");
                    });
            } else if (req.session.role == 1 || req.session.role == "1") {
                Users.find({ deletedAt:null })
                    .then(users => {
                        let usersCount = users.length;
                        Users.find({ role: 2})
                            .then(admins => {
                                let adminCount = admins.length;
                                Users.find({role: 3 })
                                    .then(activeUsers => {
                                        let activeUsersCount = activeUsers.length;
                                        Packages.find({ deletedAt:null })
                                            .then(packages => {
                                                let packageCount = packages.length;
                                                Referrals.find({delete: null })
                                                    .then(referrals => {
                                                        let referralCount = referrals.length;
                                                        res.render("dashboards/home", {
                                                            usersCount: usersCount,
                                                            adminCount: adminCount,
                                                            activeUsersCount: activeUsersCount,
                                                            referralCount: referralCount,
                                                            packageCount: packageCount,
                                                            users: activeUsers,
                                                            messages: unansweredChats
                                                        });
                                                    })
                                                    .catch(error => {
                                                        res.redirect("/");
                                                    });
                                            })
                                            .catch(error => {
                                                res.redirect("/");
                                            });
                                    })
                                    .catch(error => {
                                        res.redirect("/");
                                    });
                            })
                            .catch(error => {
                                res.redirect("/");
                            });
                    })
                    .catch(error => {
                        res.redirect("/");
                    });
                //res.render("dashboards/home");    
            } else {
                res.redirect("/");
            }
        })
        .catch(error => {
            req.flash('error', "Server error!");
            res.redirect("/");
        });


}

exports.password = (req, res, next) => {
    Chats.findAll({
            where: {
                [Op.and]: [{
                        receiver_id: {
                            [Op.eq]: req.session.userId
                        }
                    },
                    {
                        read_status: {
                            [Op.eq]: 0
                        }
                    }
                ]
            },
            include: ["user"],
        })
        .then(unansweredChats => {
            if (req.session.role == 2 || req.session.role == "2" || req.session.role == 3 || req.session.role == "3") {
                res.render("dashboards/users/user_password", {
                    messages: unansweredChats
                });
            } else if (req.session.role == 1 || req.session == "1") {
                res.render("dashboards/change_password", {
                    messages: unansweredChats
                });
            } else {
                res.redirect("/");
            }
        })
        .catch(error => {
            req.flash('error', "Server error!");
            res.redirect("/");
        });
}

exports.userReferral = (req, res, next) => {
    Chats.findAll({
            where: {
                [Op.and]: [{
                        receiver_id: {
                            [Op.eq]: req.session.userId
                        }
                    },
                    {
                        read_status: {
                            [Op.eq]: 0
                        }
                    }
                ]
            },
            include: ["user"],
        })
        .then(unansweredChats => {
            Referrals.findAll({
                    where: {
                        referral_id: req.session.userId
                    },
                    order: [
                        ['createdAt', 'DESC'],
                    ],
                    include: ["user"],
                })
                .then(referrals => {
                    Users.findOne({
                            where: {
                                id: {
                                    [Op.eq]: req.session.userId
                                }
                            }
                        })
                        .then(user => {
                            res.render("dashboards/users/user_referral", {
                                referrals: referrals,
                                messages: unansweredChats,
                                user: user
                            });
                        })
                        .catch(error => {
                            req.flash('error', "Server error!");
                            res.redirect("/");
                        });
                })
                .catch(error => {
                    res.redirect("/");
                });
        })
        .catch(error => {
            req.flash('error', "Server error!");
            res.redirect("/");
        });
}

exports.allReferral = (req, res, next) => {
    Chats.findAll({
            where: {
                [Op.and]: [{
                        receiver_id: {
                            [Op.eq]: req.session.userId
                        }
                    },
                    {
                        read_status: {
                            [Op.eq]: 0
                        }
                    }
                ]
            },
            include: ["user"],
        })
        .then(unansweredChats => {
            Referrals.findAll({
                    where: {
                        deletedAt: null
                    },
                    order: [
                        ['createdAt', 'DESC'],
                    ],
                    include: ["referrals", "user"],
                })
                .then(referrals => {
                    res.render("dashboards/all_referrals", {
                        referrals: referrals,
                        messages: unansweredChats
                    });
                })
                .catch(error => {
                    //res.redirect("/");
                    console.log(error);
                });
        })
        .catch(error => {
            req.flash('error', "Server error!");
            res.redirect("/");
        });
}