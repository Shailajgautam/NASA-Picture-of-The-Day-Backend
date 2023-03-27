
const jwt = require("jsonwebtoken");
const secret = 'RANDOM-TOKEN'

function verifyRoute(req, res) {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, secret, (err, decoded) => {
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