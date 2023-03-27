
const jwt = require("jsonwebtoken");


function oauth(req, res) {
  const email = req.user.profile.emails[0].value
    const token = jwt.sign(
      {
        userEmail: email,
      },
      "RANDOM-TOKEN",
      { expiresIn: "24h" }
    );
  res.redirect(`http://localhost:3000/?token=${token}&email=${email}`);

}
 

module.exports={
      oauth
}