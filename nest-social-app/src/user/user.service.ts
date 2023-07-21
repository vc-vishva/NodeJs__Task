import { Injectable } from '@nestjs/common';
import {
  HttpStatus,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.schema';
import {
  changePasswordModel,
  getUserProfileModel,
  UserUpdateModel,
} from './userTypes';
import { createResponse } from 'src/apiResponse';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // change password

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): changePasswordModel {
    const Id = new Types.ObjectId(userId);
    console.log(Id, '*************************;');

    const user = await this.userModel.findById(Id);
    if (!user) {
      return createResponse(false, HttpStatus.NOT_FOUND, 'user not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid current password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.logoutAll = true;
    await user.save();

    return createResponse(true, HttpStatus.OK, 'success', [user]);
  }

  // update profile

  async updateUser(
    userId: string,
    name?: string,
    email?: string,
    phoneNo?: string,
    username?: string,
  ): UserUpdateModel {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
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

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { ...user },
      { new: true },
    );

    return createResponse(
      true,
      HttpStatus.OK,
      'profile update successfully',
      updatedUser,
    );
  }

  async getUserProfile(userId: string): getUserProfileModel {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return createResponse(true, HttpStatus.OK, 'Success', user);
  }
}
