const path = require('path');

const express = require('express');
const dotenv = require('dotenv');

const session = require('express-session');

const mongoose = require('mongoose');
// Storing User in session so that app stays logged in 
//when making changes on the server and server restart
const MongoStore = require('connect-mongo')(session);
// Console logs requests
const morgan = require('morgan');
// Handle Bars
const exphbs = require('express-handlebars');

const methodOverride = require('method-override');

// Passport
const passport = require('passport');


const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

//  Passport config
require('./config/passport')(passport);


connectDB()

const app = express()

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Method Override (allows put and delete methods in html)
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Logging with morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


//Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')


// Handlebars  -- Template Engine
app.engine
  ('.hbs',
    exphbs({
      helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
      },
      defaultLayout: 'main',
      extname: '.hbs'
    })
  );
app.set('view engine', '.hbs');

// Sessions
app.use(session({
  secret: 'keyboard cat',
  // resvae wont save session if nothing is modified
  resave: false,
  //dont create a session unles something is stored
  saveUninitialized: false,
  // Stores login in MongoDB so user stays logged in even during server changes
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set gloabal var
app.use(function(req,res,next){
  res.locals.user = req.user || null
  next()
});

//Static folder
// __dirname is direct path to current directory then go to public
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

// Port number
const PORT = process.env.PORT || 3000;

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/workout',
 {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
   useCreateIndex: true,
 }
)

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))