
const jwt = require("jsonwebtoken");
require('dotenv').config();

function oauth(req, res) {
  const email = req.user.profile.emails[0].value
    const token = jwt.sign(
      {
        userEmail: email,
      },
      process.env.SECRET,
      { expiresIn: "24h" }
    );
  res.redirect(`${process.env.FRONTEND_URL}/?token=${token}&email=${email}`);

}
 

module.exports={
      oauth
}