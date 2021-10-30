if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const passport = require('passport');
const app = express();
const flash = require('express-flash');
const session = require('express-session');

const { register, getUserByEmail, getUserById } = require('./models/users');

const initializePassport = require('./passport-config');
initializePassport(passport, getUserByEmail, getUserById);

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return res.redirect('/');
  }
  next();
}

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name});
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs' );
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

app.get('/register', (req, res) => {
  res.render('register.ejs' );
});

app.post('/register', async (req, res) => {
  const result = await register(req.body);
  if (result) {
    return res.render('login.ejs' );
  }
  return res.render('register.ejs' );
});

app.post('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

app.listen(3000);