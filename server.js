const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const passport = require('passport')
const indexRoutes = require('./routes/index')
const authRoutes = require('./routes/auth')

const morgan = require('morgan')
const webParameters = require("./config/web_params.json");

const dotenv = require('dotenv')

const connectDB = require('./config/db')
require('./config/passport')(passport)

dotenv.config({path:'./config/config.env'})

connectDB()

const app = express()

const PORT = process.env.PORT || 4000

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//session
app.use(session({
    secret:'tobechanged',
    resave:true,
    saveUninitialized:true
}))

app.locals = webParameters;

//passport
app.use(passport.initialize())
app.use(passport.session())


app.use(morgan('dev'))
// set up public folder
app.use(express.static(path.join(__dirname, "public")));
// Static Files
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/images', express.static(__dirname + 'public/images'));
//app.use('/fonts', express.static(__dirname + 'public/fonts'))

app.use(indexRoutes)
app.use(authRoutes)


app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`)
})
















