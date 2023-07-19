import User from "../models/users.js";
import userService from "../services/userService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateUniqueUsername } from "../utils/helper.js";
//
// const generateUniqueUsername = async (name) => {
//   try {
//     const lowercasedName = name.toLowerCase().replace(/\s/g, "");
//     const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
//     const username = lowercasedName + randomNumber;
//     return username;
//   } catch (error) {}
// };

/**
 * @swagger
 * components:
 * schemas:
 *  users:
 *   type:object
 *     required:
 *    -name
 *    -email
 *    -username
 *    -password
 *    -phoneNo
 *     properties:
 *         id:
 *         type: ObjectId
 *         name:
 *         type: String
 *         email:
 *         type: String
 *         username:
 *         type: String
 *         password:
 *         type: String
 *         phoneNo
 *         type: number
 */

//1
const userController = {
  signup: async (req, res) => {
    try {
      const { name, email, phoneNo, password } = req.body;

      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }

      const saltRounds = 10;
      // const hashedPassword = await bcrypt.hash(password, saltRounds);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const username = await generateUniqueUsername(name);

      const user = new User({
        name,
        email,
        phoneNo,
        password: hashedPassword,
        username,
      });

      await user.save();

      res
        .status(201)
        .send({ message: "User created successfully", data: user });
    } catch (error) {
      res.status(500).send({ error: "Failed to create user" });
    }
  },

  //2- login

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).send({ token });
    } catch (error) {
      res.status(500).send({ error: "Failed to authenticate user" });
    }
  },
  //3- change password

  changePassword: async (req, res) => {
    try {
      const { userId, currentPassword, newPassword } = req.body;

      const user = await User.findById(userId);
      console.log(userId);
      console.log(userId, currentPassword, newPassword);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).send({ error: "Incorrect current password" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      user.password = hashedPassword;
      await user.save();

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      user.logoutAll = true;
      await user.save();

      res.status(200).send({ message: "success" });
    } catch (error) {
      res.status(500).send({ error: "Failed to change password" });
    }
  },
  // 4
  changeInfo: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, phoneNo, username } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ status: 404, message: "User not found" });
      }

      if (name) {
        user.name = name;
      }

      if (email) {
        user.email = email;
      }

      if (phoneNo) {
        user.phoneNo = phoneNo;
      }

      if (username) {
        user.username = username;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { ...user },
        { new: true }
      );

      res.status(200).send({ message: "Success", data: updatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Failed to update user" });
    }
  },
  // 5
  userProfile: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      res.status(200).send({ message: "Success", data: user });
    } catch (error) {
      res.status(500).send({ error: "Failed to retrieve user" });
    }
  },
};

export default userController;
