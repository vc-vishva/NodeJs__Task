import { Router } from "express";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../db/connection.js";
import verifyToken from "../../authentication.js";

const usersRouter = Router();
const salt = 10;
const db = client.db("users");

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

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwt.sign({ email, _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).send({ status: 200, message: "Success", token });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});

//3- verify

//4 get all user
usersRouter.get("/lists", async (req, res) => {
  try {
    const user = await db.collection("userDetails").find().toArray();
    // const users = await Promise.all([...getuser.map((user) => user)]);

    res.status(200).send({ status: 200, data: user });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});

//5- get specific user

usersRouter.get("/:id", verifyToken, async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const user = await db
      .collection("userDetails")
      .findOne({ _id: new ObjectId(requestedUserId) });

    if (user) {
      res.status(200).send({ status: 200, data: user });
    } else {
      res.status(404).send({ status: 404, message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});

//6- update
usersRouter.put("/:id", verifyToken, async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const updateUser = req.body;

    const user = await db
      .collection("userDetails")
      .findOne({ _id: new ObjectId(requestedUserId) });

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
      .updateOne({ _id: new ObjectId(requestedUserId) }, { $set: updatedUser });

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
usersRouter.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const query = { _id: userId };
    const user = await db.collection("userDetails").deleteOne(query);

    if (user.deletedCount > 0) {
      res
        .status(200)
        .send({ status: 200, message: "Successfully deleted", data: user });
    } else {
      res.status(404).send({ status: 404, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});
export default usersRouter;
