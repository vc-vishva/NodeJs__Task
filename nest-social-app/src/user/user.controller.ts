import {
  Controller,
  Get,
  Patch,
  Put,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ChangePasswordDto, UpdateUserDto } from './createUser.Dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  UserUpdateModel,
  changePasswordModel,
  getUserProfileModel,
} from './userTypes';
import { AuthenticatedUserId } from './user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('change')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @AuthenticatedUserId() userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): changePasswordModel {
    console.log(userId), 'lllll';

    const { currentPassword, newPassword } = changePasswordDto;

    return this.userService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @AuthenticatedUserId() userId: string,

    @Body() updateUserDto: UpdateUserDto,
  ): UserUpdateModel {
    const { name, email, phoneNo, username } = updateUserDto;
    return this.userService.updateUser(userId, name, email, phoneNo, username);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserProfile(
    @AuthenticatedUserId() userId: string,
  ): getUserProfileModel {
    return this.userService.getUserProfile(userId);
  }
}
