const bcrypt = require("bcrypt");
const User = require("../models/user")
const jwt = require("jsonwebtoken");

// login endpoint
function loginRoute(request, response) {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      if (!user) {
        return response.status(404).send({
          success: false,
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
              success: false,
              message: "Passwords do not match",
            });
          }

          // create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          // send success message and token to frontend
          response.status(200).send({
            success: true,
            message: "Login successful",
            token: token
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            success: false,
            message: "Passwords do not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(500).send({
        success: false,
        message: "Error finding user",
        e,
      });
    });
}

module.exports = {
  loginRoute
}
