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
    secret: "myscretekey",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      path: path.join(path.resolve(), "../store-session/sessions"),
    }),
  })
);

// Check login or not
const checkLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).redirect("/login");
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

app.get("/login",  (req, res) => {
  res.status(200).sendFile(__dirname + "/login.html");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const userData = readUserData();
  if (req.session.user) {
    res.status(403).redirect("/dashboard");
    return;
  }
  const user = userData.find((user) => user.email === email);
  if (user && comparePassword(password, user.password)) {
    req.session.user = user;
    res.status(200).redirect("/dashboard");
  } else {
    res.status(401).send("Invalid email or password");
  }
});

// Sign up route
app.get("/signup",  (req, res) => {
  res.status(200).sendFile(__dirname + "/signup.html");
});

app.post("/signup", (req, res) => {
  const { name, email, password, phone } = req.body;
  const userData = readUserData();
  // Check if the user already exists
  const existingUser = userData.find((user) => user.email === email);
  if (existingUser) {
    res.status(409).send("You are already signed up");
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
  res.status(201).redirect("/dashboard");
});

// Dashboard route
app.get("/dashboard", checkLoggedIn, (req, res) => {
  res.status(200).sendFile(__dirname + "/dashboard.html");
});

// User route
app.get("/user", checkLoggedIn, (req, res) => {
  res.status(200).json(req.session.user);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  delete req.cookies["connect.sid"];
  res.status(200).redirect("/login");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is started ${port}`);
});


