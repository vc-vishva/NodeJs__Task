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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('change')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): changePasswordModel {
    const { currentPassword, newPassword } = changePasswordDto;
    const { authenticatedUser } = req;
    const userId = authenticatedUser.id;

    return this.userService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): UserUpdateModel {
    const { name, email, phoneNo, username } = updateUserDto;
    const { authenticatedUser } = req;
    const userId = authenticatedUser.id;

    return this.userService.updateUser(userId, name, email, phoneNo, username);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Request() req): getUserProfileModel {
    const { authenticatedUser } = req;
    const userId = authenticatedUser.id;
    return this.userService.getUserProfile(userId);
  }
}
