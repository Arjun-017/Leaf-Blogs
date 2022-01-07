const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).render("unautherized");
    }
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (!verified) {
      return res.json(401).render("unautherized");
    }
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).render("unautherized");
  }
}

module.exports = auth;
