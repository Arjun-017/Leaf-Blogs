const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).redirect("/user");
    }
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (!verified) {
      return res.status(400).redirect("/user");
    }
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).redirect("/user");
  }
}

module.exports = auth;
