import User from "../models/users";
import { IUser } from "../types/type";
import * as userService from "../services/userService";
import { Express, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { test } from "../middleware/verify";
import apiResponse from "../utils/response";

// sign up

export const signup = async (req: Request & test, res: Response) => {
  try {
    const { f_name, l_name, email, password } = req.body;

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return apiResponse(res, 409, "User with this email already exists");
    }

    const hashPassword = await userService.hashPassword(password);

    const user = await userService.createUser(
      f_name,
      l_name,
      email,
      hashPassword
    );

    apiResponse(res, 201, "User created successfully", [user]);
  } catch (error) {
    apiResponse(res, 500, "Failed to create user", [], [error]);
  }
};

// login

export const login = async (req: Request & test, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return apiResponse(res, 400, "Email and password are required");
    }
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return apiResponse(res, 401, "Invalid email or password");
    }
    const passwordMatch = await userService.comparePasswords(
      password,
      user.password
    );
    if (!passwordMatch) {
      return apiResponse(res, 401, "Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as Secret, {
      expiresIn: "24h",
    });
    apiResponse(res, 201, "Success", [token]);
  } catch (error) {
    console.log("Error:", error);
    apiResponse(res, 500, "Internal Server Error", [], [error]);
  }
};

// changePassword

export const changePassword = async (req: Request & test, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const id = req.id;
    const user: IUser | null = await userService.getUserById(id);
    if (!user) {
      return apiResponse(res, 401, "User not found");
    }
    const passwordMatch: boolean = await userService.comparePasswords(
      currentPassword,
      user.password
    );
    if (!passwordMatch) {
      return apiResponse(res, 401, "Incorrect current password");
    }

    const hashPassword: string = await userService.hashPassword(newPassword);

    user.password = hashPassword;
    await user.save();

    const token: string = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as Secret,
      { expiresIn: "24h" }
    );
    apiResponse(res, 200, "User password  updated successfully", [user]);
  } catch (error) {
    apiResponse(res, 500, "Internal Server Error", [], [error]);
  }
};

// change user info

export const ProfileEdit = async (req: Request & test, res: Response) => {
  try {
    const { f_name, l_name, email } = req.body;
    const id = req.id;

    const existingUser = await userService.getUserById(id);
    if (!existingUser) {
      return apiResponse(res, 404, "User not found");
    }

    existingUser.f_name = f_name || existingUser.f_name;
    existingUser.l_name = l_name || existingUser.l_name;
    existingUser.email = email || existingUser.email;

    const updatedUser = await userService.updateUser(existingUser);

    apiResponse(res, 200, "User updated successfully", [updatedUser]);
  } catch (error) {
    apiResponse(res, 500, "Internal Server Error", [], [error]);
  }
};

// delete user

export const deleteUser = async (req: Request & test, res: Response) => {
  try {
    const id = req.id;
    const user = await userService.deleteUser(id);

    apiResponse(res, 200, "User password  deleted successfully", [user]);
  } catch (error) {
    console.log(error);

    apiResponse(res, 500, "Internal Server Error", [], [error]);
  }
};
