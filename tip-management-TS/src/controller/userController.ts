import User from "../models/users";
import { IUser } from "../types/type";
import * as userService from "../services/userService";
import { validationResult } from "express-validator";
import { Express, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { test } from "../middleware/verify";

// sign up

export const signup = async (req: Request & test, res: Response) => {
  try {
    const { f_name, l_name, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const hashPassword = await userService.hashPassword(password);

    const user = await userService.createUser(
      f_name,
      l_name,
      email,
      hashPassword
    );

    res.status(201).send({ message: "User created successfully", data: user });
  } catch (error) {
    res.status(500).send({ error: "Failed to create user" });
  }
};

// login

export const login = async (req: Request & test, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: 400, message: "Email and password are required" });
    }
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .send({ status: 401, message: "Invalid email or password" });
    }
    const passwordMatch = await userService.comparePasswords(
      password,
      user.password
    );
    if (!passwordMatch) {
      return res
        .status(401)
        .send({ status: 401, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as Secret, {
      expiresIn: "24h",
    });
    res.status(200).send({ status: 200, message: "Success", token });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};

// changePassword

export const changePassword = async (req: Request & test, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const id = req.id;
    const user: IUser | null = await userService.getUserById(id);
    if (!user) {
      return res.status(401).send({ status: 401, message: "User not found" });
    }
    const passwordMatch: boolean = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).send({ error: "Incorrect current password" });
    }
    const saltRounds = 10;
    const hashPassword: string = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashPassword;
    await user.save();

    const token: string = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as Secret,
      { expiresIn: "24h" }
    );
    res.status(200).send({ message: "Success", data: user });
  } catch (error) {
    res.status(500).send({ error: "Failed to change password" });
  }
};

// change user info

export const ProfileEdit = async (req: Request & test, res: Response) => {
  try {
    const { f_name, l_name, email } = req.body;
    const id = req.id;

    const existingUser = await userService.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    existingUser.f_name = f_name || existingUser.f_name;
    existingUser.l_name = l_name || existingUser.l_name;
    existingUser.email = email || existingUser.email;

    const updatedUser = await userService.updateUser(existingUser);

    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// delete user

export const deleteUser = async (req: Request & test, res: Response) => {
  try {
    const id = req.id;
    const user = await userService.deleteUser(id);

    res
      .status(200)
      .send({ status: 200, message: "Successfully deleted", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};
