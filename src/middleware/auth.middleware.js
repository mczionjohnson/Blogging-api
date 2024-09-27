import jwt from "jsonwebtoken";
// import logger from '../logger/logger.js'

const secret = process.env.JWT_SECRET;

const checkAuth = (req, res, next) => {
  // console.log(req.cookies.jwt)
  // because of cookie-parser and we named it 'jwt'
  const token = req.cookies.jwt;

  // check
  if (token != null) {
    // SECRET is stored in .env
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized2" });
      } else {
        // calling next since the check is successful
        req.body.user = decoded; //passing it on
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Unauthorized1" });
  }
};

export default checkAuth;
