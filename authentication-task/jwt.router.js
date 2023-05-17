const jwtRouter = require("express").Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
jwtRouter.use(bodyParser.json());
// const app = express();
const path = require('path')
const data = require('./db.json');
const jwt = require('jsonwebtoken');
const dbPath = './db.json';
const fs = require('fs/promises');


//
jwtRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // password is not empty
    if (!password || password.trim() === '') {
      return res.status(400).send('Password is required.');
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Read db.json file
    const data = await fs.readFile('db.json');
const users = JSON.parse(data.toString());


    // Check if email already exists
    const user = users.find(u => u.email === email);
    if (user) {
      return res.status(400).send('User already registered.');
    }

    // Add new user 
    users.push({ name, email, password: hashedPassword });
   await fs.writeFile('db.json', JSON.stringify(users));

    res.send('User registered successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
});

///
jwtRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists in db.json file
    const data = await fs.readFile('db.json');
    const users = JSON.parse(data.toString());
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).send('Invalid email or password.');
    }

    // Compare password with hashed password in db.json file
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password.');
    }

    // Create and send JWT token
    // Create and send JWT token
const token = jwt.sign({ email: user.email, password: user.password }, 'mysecretkey');
res.send({ token });


  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
});
//
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('No token provided.');
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'mysecretkey', (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token.');
    }
    req.email = decoded.email; // Update this line
    req.password = decoded.password; // Update this line
    next();
  });
};


// Protected API
jwtRouter.get('/protected', verifyToken, async (req, res) => {
  try {
    const data = await fs.readFile(dbPath);
    const users = JSON.parse(data.toString());
    const user = users.find(u => u.email === req.email && u.password === req.password);
    if (!user) {
      return res.status(404).send('User not found.');
    }
    res.send(`Welcome, ${user.name}!`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
});


module.exports = jwtRouter;


