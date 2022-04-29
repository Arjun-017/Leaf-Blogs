const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { response } = require("express");

router.get("/", (req, res) => {
  if (req.user) {
    return res.redirect(`/:${req.user.id}`);
  } else {
    res.render("login");
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const exists = await User.find({ email: email });
  if (exists.length > 0) {
    return res.status(501).json("User already exists!");
  }
  await bcrypt.hash(password, 10, (error, hashedPassword) => {
    const newUser = new User({ email: email, password: hashedPassword });
    newUser.save().catch((err) => console.log(err));
  });
  res.redirect("/user");
});

router.get("/register", async (req, res) => {
  res.render("register");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email });
  if (currentUser == null) {
    return res.json("User not found!");
  }

  bcrypt.compare(password, currentUser.password, (err, isValid) => {
    if (isValid) {
      const token = jwt.sign(
        { email: email, id: currentUser.id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.cookie("token", token);
      res.redirect(`/profile`);
    }
  });
});

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

module.exports = router;
