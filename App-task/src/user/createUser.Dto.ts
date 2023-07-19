import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  phoneNo?: string;
}

export class LoginUserDto {
  userId: ObjectId;
  email: string;
  password: string;
}

export class UpdateUserDto {
  userId: string;
  name?: string;
  email?: string;
  phoneNo?: string;
  username?: string;
}
export class ChangePasswordDto {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
