import express from "express";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import client from "../db/connection.js";
const usersRouter = express.Router();
const salt = 10;
const db = client.db("users");
// import ObjectId from "mongodb";

//1- sign-up

usersRouter.post("/", async (req, res) => {
  try {
    const { f_name, l_name, email, password } = req.body;
    const hashpassword = await bcrypt.hash(password, salt);

    const newUser = {
      f_name: f_name,
      l_name: l_name,
      email: email,
      password: hashpassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const saveUser = await db.collection("userDetails").insertOne(newUser);

    res.status(200).send({
      status: 200,
      message: "You are successfully signed up",
      data: newUser,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});

//2//- sign-in
usersRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send("Email is required");
    }

    const user = await db.collection("userDetails").findOne({ email });
    console.log("====================", user);

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("--------------------", match);

    if (!match) {
      return res.status(400).send("Invalid email or password");
    }

    let data = { email, _id: user._id };
    const token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });
    console.log("token --------------", token);

    res.status(200).send({ status: 200, message: "Success", data: token });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});

//3- verify

usersRouter.get("/verify", async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    const userId = decoded._id;
    return res
      .status(200)
      .send({ status: 200, message: "Token is valid", userId });
  } catch (error) {
    return res.status(401).send({ status: 401, message: "Invalid token" });
  }
});

//4 get all user
usersRouter.get("/lists", async (req, res) => {
  try {
    const getuser = db.collection("userDetails").find();
    const users = await Promise.all([...getuser.map((user) => user)]);

    res.status(200).send({ status: 200, data: users });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});

//5- get specific user

usersRouter.get("/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const query = { _id: userId };
    const user = await db.collection("userDetails").findOne(query);

    console.log(query, "--------", "query");

    if (user) {
      res.status(200).send({ status: 200, data: user });
    } else {
      res.status(404).send({ status: 404, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});

//6- update
usersRouter.put("/user/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const updateUser = req.body;
    const query = { _id: userId };

    const user = await db.collection("userDetails").findOne(query);

    if (!user) {
      res.status(404).send({ status: 404, message: "User not found" });
      return;
    }

    const updatedUser = {
      ...user,
      ...updateUser,
      updatedAt: new Date(),
    };

    const result = await db
      .collection("userDetails")
      .updateOne(query, { $set: updatedUser });

    if (result.modifiedCount === 1) {
      res.status(200).send({
        status: 200,
        message: "User updated successfully",
        data: updateUser,
      });
    } else {
      res.status(500).send({ status: 500, message: "Failed to update user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});

//7-delete
usersRouter.delete("/:id", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const query = { _id: userId };
    const user = await db.collection("userDetails").deleteOne(query);

    console.log(query, "--------", "query");

    if (user) {
      res
        .status(200)
        .send({ status: 200, message: "sucessfully delete", data: user });
    } else {
      res.status(404).send({ status: 404, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});
export default usersRouter;
