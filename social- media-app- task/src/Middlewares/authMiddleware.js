import User from '../models/users.js';
import jwt  from 'jsonwebtoken';
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ message: "Access denied. No token provided." });
    }


    const token = authHeader.split(" ")[1];
    console.log("token", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // if (user.logoutAll) {
    //   return res.status(401).send({ error: 'User logged out from all devices' });
    // }

    console.log(user);
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: 'Unauthorized....' });
  }
};

export default authMiddleware;