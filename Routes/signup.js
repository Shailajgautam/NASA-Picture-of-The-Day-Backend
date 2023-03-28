const bcrypt = require("bcryptjs");
const User = require("../models/user")

async function signupRoute (req, res) {
      const { name, email, password } = req.body;
      try {
        const user = await User.findOne({ email });
        if (user) {
          res.send({ message: "User already registered" });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
          });
          await newUser.save();
          res.send({ message: "Successfully Registered, Please login now." });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error registering user" });
      }
    }

    module.exports={
      signupRoute
    }


    