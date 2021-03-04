const express = require('express')

const router = express.Router()

//user dashboard
router.get('/', (req,res)=>{
    res.render("dashboards/users/user_home")
})

//admin dashboard
router.get('/home', (req,res)=>{
    res.render('dashboards/home',{
        user:req.user
    })
} )

//fundwallet
router.get('/fundwallet', (req,res)=>{
    res.render('dashboards/users/user_wallet')
} )

router.get('/settings', (req,res)=>{
    res.render('dashboards/users/user_settings')
})

//withdraw
router.get('/withdraw', (req,res)=>{
    res.render('dashboards/users/user_withdrawals')
})
module.exports = router