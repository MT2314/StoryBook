const path = require('path');

const express = require('express');
const dotenv = require('dotenv');

const session = require('express-session');

// Console logs requests
const morgan = require('morgan');
// Handle Bars
const exphbs = require('express-handlebars');
// Passport
const passport = require('passport');


const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env'})

//  Passport config
require('./config/passport')(passport);


connectDB()

const app = express()

// Logging with morgan
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars  -- Template Engine
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
    secret: 'keyboard cat',
    // resvae wont save session if nothing is modified
    resave: false,
    //dont create a session unles something is stored
    saveUninitialized: false,
  }))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Static folder
// __dirname is direct path to current directory then go to public
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))