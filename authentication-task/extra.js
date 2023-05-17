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
      req.userId = decoded.userId;
      next();
    });
  };
  
  // Protected API
  jwtRouter.get('/protected', verifyToken, async (req, res) => {
    try {
      const data = await fs.readFile(dbPath);
      const users = JSON.parse(data.toString());
      const user = users.find(u => u.id === req.userId);
      if (!user) {
        return res.status(404).send('User not found.');
      }
      res.send(`Welcome, ${user.name}!`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
      }
    });