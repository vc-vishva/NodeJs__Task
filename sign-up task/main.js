const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "myscreatekey",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      path: path.join(path.resolve(), "../store-session/sessions"),
    }),
  })
);
//check login or not
const checkLoggedIn = (req, res, next) => {
  console.log(req.session.user, ",,,,,,,,,,,,,,,,,req.session.user");
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};
const checkNotLoggedIn = (req, res, next) => {
  console.log(req.session.user, "req.session.user");
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    next();
  }
};
const readUserData = () => {
  const userData = fs.readFileSync("db.json");
  return JSON.parse(userData);
};
const writeUserData = (data) => {
  fs.writeFileSync("db.json", JSON.stringify(data));
};
const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
app.get("/login", checkNotLoggedIn, (req, res) => {
  console.log("get login");
  res.sendFile(__dirname + "/login.html");
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const userData = readUserData();
  console.log(req.session.user, "====>  req.session.user");
  if (req.session.user) {
    res.redirect("/dashboard");
    return;
  }
  const user = userData.find((user) => user.email === email);
  if (user && comparePassword(password, user.password)) {
    req.session.user = user;
    res.redirect("/dashboard");
  } else {
    res.send("Invalid email or password");
  }
});
// Sign up route
app.get("/signup", checkNotLoggedIn, (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/signup", (req, res) => {
  const { name, email, password, phone } = req.body;
  const userData = readUserData();
  // Check if the user already exists
  const existingUser = userData.find((user) => user.email === email);
  if (existingUser) {
    res.send("You are already signed up");
    return;
  }
  const hashedPassword = hashPassword(password);
  const newUser = {
    id: userData.length + 1,
    name,
    email,
    password: hashedPassword,
    phone,
  };
  // Add user
  userData.push(newUser);
  writeUserData(userData);
  req.session.user = newUser;
  res.cookie("userId", newUser.id); //cookiesave
  res.redirect("/dashboard");
});
// Dashboard route
app.get("/dashboard", checkLoggedIn, (req, res) => {
  res.sendFile(__dirname + "/dashboard.html");
});
// User route
app.get("/user", checkLoggedIn, (req, res) => {
  res.json(req.session.user);
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  delete req.cookies["connect.sid"];
  console.log(req.cookies, "cookies");
  res.redirect("/login");
});
// Start the server
app.listen(port, () => {
  console.log(`Server is started ${port}`);
});
