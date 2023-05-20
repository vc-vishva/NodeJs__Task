const jwtRouter = require("express").Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
jwtRouter.use(bodyParser.json());
const jwt = require("jsonwebtoken");
const dbPath = process.env.DATA_PATH;
const fs = require("fs/promises");

jwtRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // password is not empty
    if (!password || password.trim() === "") {
      return res.status(400).json({ error: "Password is required." });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Read db.json file
    const data = await fs.readFile("db.json");
    const users = JSON.parse(data.toString());
    // Check if email already exists
    const user = users.find((u) => u.email === email);
    if (user) {
      return res.status(400).json({
        error: "User already registered.",
        user: { name, email, password: hashedPassword },
      });
    }
    // Add new user
    users.push({ name, email, password: hashedPassword });
    await fs.writeFile("db.json", JSON.stringify(users));
    res.status(200).json({
      message: "User registered successfully.",
      user: { name, email, password: hashedPassword },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

jwtRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists in db.json file
    const data = await fs.readFile(dbPath);
    const users = JSON.parse(data.toString());
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare password with hashed password in db.json file
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    // Create and send JWT token
    const token = jwt.sign(
      { email: user.email, password: user.password },
      process.env.SECRET_KEY
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.email = decoded.email;
    req.password = decoded.password;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
};
// Protected API
jwtRouter.get("/protected", verifyToken, async (req, res) => {
  try {
    const data = await fs.readFile(dbPath);
    const users = JSON.parse(data.toString());
    const user = users.find(
      (u) => u.email === req.email && u.password === req.password
    );
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const response = {
      message: "Welcome",
      user: {
        name: user.name,
        email: user.email,
      },
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});
module.exports = jwtRouter;
