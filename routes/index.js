const express = require('express')
const passport = require('passport')
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth')
const router = express.Router()


//user dashboard
router.get('/', ensureAuthenticated, async (req,res)=>{
    res.render("dashboards/users/user_home",{
        user:req.user
    })
})
//packages
router.get('/packages', (req,res)=>{
    res.render('dashboards/users/packages',{
        user:req.user
    })
})
//admin dashboard
router.get('/home', (req,res)=>{
    res.render('dashboards/home',{
        user:req.user
    })
})



router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/signup'
    })(req,res,next)
})

router.post('/logout',(req,res,next)=>{
    req.logout()
    res.redirect('/signup')
})

// //admin dashboard
// router.get('/home', (req,res)=>{
//     res.render('dashboards/home',{
//         user:req.user
//     })
// } )

//fundwallet
router.get('/fundwallet', (req,res)=>{
    res.render('dashboards/users/user_wallet')
} )

router.get('/user_chat', (req,res)=>{
    res.render('dashboards/users/user_chat')
})

router.get('/investments', (req,res)=>{
    res.render('dashboards/users/user_investment')
})

router.get('/settings', (req,res)=>{
    res.render('dashboards/users/user_settings')
})

//view unapproved deposits for admin
router.get('/bank-unapproved',(req,res)=>{
    res.render('dashboards/bank_deposits')
})

//view approved deposits
router.get('/bank-approved',(req,res)=>{
    res.render('dashboards/approved_deposits')
})

//view approved withdrawal
router.get('/approved-withdrawal', (req,res)=>{
    res.render('dashboards/approved_withdrawals')
})


//view all active users
router.get('/users',(req,res)=>{
    res.render('dashboards/all_users')
})

//view all deleted users
router.get('/deleted/users', (req,res)=>{
    res.render('dashboards/deleted_users')
})


//view unapproved withdrawals
router.get('/unapproved-withdrawal', (req,res)=>{
    res.render('dashboards/unapproved_withdrawals')
})

//add package
router.get('/add/package', (req,res)=>{
    res.render('dashboards/add_packages')
})

//view packages
router.get('/view/packages',(req,res)=>{
    res.render('dashboards/packages_admin')
})

//withdraw
router.get('/withdraw', (req,res)=>{
    res.render('dashboards/users/user_withdrawals')
})

//admin change password
router.get('/password', (req,res)=>{
    res.render('dashboards/change_password')
})

//admin input bank details
router.get('/bankdetails', (req,res)=>{
    res.render('dashboards/bank_details')
})

module.exports = router