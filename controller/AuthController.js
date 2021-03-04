const bcrypt = require("bcryptjs");
const uniqueString = require('unique-string');
const generateUniqueId = require('generate-unique-id');
const User = require('../models/User')
const Referrals = require('../models/Referral')



// Register

//login Controller
exports.login = (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    if (email && password) {
        User.findOne({
                
                    email: req.body.email
                    
                
            })
            .then((user) => {
                console.log(user)
                if (user) {
                    let password = req.body.password;
                    if (bcrypt.compareSync(password, user.password)) {
                        req.session.userId = user.id;
                        req.session.role = user.role;
                        console.log(user.role)
                        res.redirect("/");
                        if(user.role=='2'){
                            res.redirect('/signup')
                        }
                    } else {
                        req.flash('warning', "Invalid credentials");
                        res.redirect("back");
                    }
                } else {
                    req.flash('warning', "Invalid credentials");
                    res.redirect("back");
                }
            })
            .catch(error => {
                req.flash('error', "Try again, something went wrong!");
                res.redirect("back");
            });
    } else {
        req.flash('warning', "Invalid credentials");
        res.redirect("back");
    }
}


  
//POST handle signup FORM
exports.register = (req, res, next) => {
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const digits_only = string => [...string].every(c => '+0123456789'.includes(c));
    const {
        name,
        email,
        phone,
        password,
    } = req.body;
    console.log(req.body)
    if (!name) {
        req.flash('warning', "Please enter name");
        res.redirect("back");
    } else if (!email) {
        req.flash('warning', "Please enter email");
        res.redirect("back");
    } else if (!phone) {
        req.flash('warning', "Please enter phone");
        res.redirect("back");
    } else if (!password) {
        req.flash('warning', "Please enter password");
        res.redirect("back");
    } else if (!email.match(mailformat)) {
        req.flash('warning', "Enter valid email address");
        res.redirect("back");
    } else if (!digits_only(phone) || phone.length < 11) {
        req.flash('warning', "Enter valid mobile phone");
        res.redirect("back");
    } else if (name.length < 5) {
        req.flash('warning', "Name must be greater than 5 letters");
        res.redirect("back");
    } else if (password.length < 6) {
        req.flash('warning', "Passwords must be greater than 5 letters");
        res.redirect("back");
    } else {
        let uniqueRef = generateUniqueId({
            length: 8,
            useLetters: true
          });
          console.log(uniqueRef)
        
        User.findOne({email:email})
        .then((user) => {


            if (!user) {
                console.log('correct')
                let name = req.body.name;
                let email = req.body.email;
                let phone = req.body.phone;
                let password = bcrypt.hashSync(req.body.password, 10);

                // check the user with that particular reference
                User.findOne({
                        
                            reference:req.session.ref
                          
                    })
                    .then(refuser => {
                        // if the reference is valid, add it to the user as its referral
                        if (refuser) {
                            User.create({
                                    name: name,
                                    email: email,
                                    phone: phone,
                                    password: password,
                                    reference: uniqueRef,
                                    referral_id: refuser.id
                                })
                            
                                .then((newuser) => {
                                    console.log(newuser)
                                    // add user to the referral section
                                    Referrals.create({
                                            referral_id: refuser.id,
                                            user_id: newuser.id
                                        })
                                        .then(referral => {
                                            // increase user referrals
                                            req.flash('success', "Registration successful");
                                            res.redirect("/home");
                                            console.log('E reach house')
                                            req.session.ref = "";
                                        })
                                        .catch(error => {
                                            req.flash('error', "Something went wrong try again");
                                            res.redirect("back");
                                        });
                                })
                                .catch(error => {
                                    req.flash('error', "Something went wrong try again");
                                    res.redirect("back");
                                });
                        } else {
                            // if referral is not valid, just create the user like that
                            User.create({
                                    name: name,
                                    email: email,
                                    phone: phone,
                                    password: password,
                                    reference: uniqueRef
                                })
                                .then((response) => {
                                    console.log(response)
                                    req.flash('success', "Registration successful");
                                    res.redirect("/");
                                    console.log('E reach house222222')
                                    req.session.ref = "";
                                })
                                .catch(error => {
                                    req.flash('error', "Something went wrong try again");
                                    res.redirect("back");
                                });
                        }
                    })
                    .catch(error => {
                        req.flash('error', "Something went wrong try again");
                        res.redirect("back");
                    });
            } else {
                req.flash('warning', "Email already taken!");
                res.redirect("back");
            }
        })
        .catch(error => {
            req.flash('error', "Something went wrong try again");
            res.redirect("back");
        });
    }
    
}
