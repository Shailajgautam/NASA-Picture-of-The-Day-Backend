
const jwt = require("jsonwebtoken");

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

export default verifyRoute;