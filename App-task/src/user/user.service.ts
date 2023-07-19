import { Injectable } from '@nestjs/common';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid current password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Password changed successfully', user };
  }

  async updateUser(
    userId: string,
    name?: string,
    email?: string,
    phoneNo?: string,
    username?: string,
  ) {
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

    return { message: 'profile update successfully', updatedUser };
  }

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'Success', data: user };
  }
}
