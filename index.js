const express = require('express');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const secret = 'RANDOM-TOKEN';
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true }));


mongoose.connect('mongodb://localhost:27017/LoginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({

  
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"]
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
})


const User = new mongoose.model("User", userSchema)



passport.use(new GoogleStrategy({
  clientID: '918874201442-7fspioengr7nicpr7fvquf16c18v6sst.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  return done(null, { accessToken, profile });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google",
  passport.authenticate('google', { scope: ['email', 'profile'] }));

  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {

    const token = jwt.sign({ email: req.user.email }, secret, { expiresIn: '1h' });
  
    res.cookie('Token', token, { httpOnly: true });
  });

// register endpoint
app.post("/signup", async (req, res) => {
  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create a new user instance and collect the data
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    // save the new user
    const result = await user.save();

    res.status(201).send({
      message: "User Created Successfully",
      result,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error creating user",
      error,
    });
  }
});



// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      if (!user) {
        return response.status(404).send({
          message: "Email not found",
        });
      }

      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords do not match",
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords do not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(500).send({
        message: "Error finding user",
        e,
      });
    });
});


app.get('/verify', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).send('Unauthorized');
    } else {
      res.status(200).send(decoded);
    }
  });
});



app.listen(5000,() => {
  console.log("BE started at port 5000")
})





