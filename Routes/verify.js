
const jwt = require("jsonwebtoken");
require('dotenv').config();

function verifyRoute(req, res) {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token,process.env.SECRET, (err, decoded) => {
            if (err) {
                  res.status(401).send('Unauthorized');

            } else {
                  res.status(200).send(decoded);
            }
      });
}

module.exports = {
      verifyRoute
}