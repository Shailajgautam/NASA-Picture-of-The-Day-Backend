const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { verifyRoute } = require('./Routes/verify');
const { signupRoute } = require('./Routes/signup');
const { loginRoute } = require('./Routes/login');
const { oauth } = require('./Routes/oauth')
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true }));


//Connection to Database
mongoose.connect('mongodb://localhost:27017/LoginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



// For Google Oauth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true,
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, { accessToken, profile });
  }));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());



app.get("/auth/google", passport.authenticate('google', { scope: ['email profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), oauth)



app.post("/signup", signupRoute);

app.post("/login", loginRoute);

app.get('/verify', verifyRoute);



app.listen(5000, () => {
  console.log("BE started at port 5000")
})





