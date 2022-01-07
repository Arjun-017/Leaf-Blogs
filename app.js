const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");

const loginRoute = require("./routes/user");
const userRoute = require("./routes/blog");
const Blog = require("./models/Blog");
const auth = require("./middlewares/auth");

//Creating server app
const app = express();

//Configuring dotenv
dotenv.config();

//Using middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use("/user", loginRoute);
app.use("/profile", auth, userRoute);
//set the view engine
app.set("view engine", "ejs");

//Setting port variable
const PORT = process.env.PORT || 5000;

//rendering views
app.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.render("home", { blogs });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/:id", auth, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("blog", { blog });
});
//Connecting to the databse
mongoose.connect(process.env.DB_URI, () => {
  console.log("Database connected");
});
//Running server on PORT
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}... `);
});
