import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../user/createUser.Dto';
import { MyCustomResponse, createResponse } from '../apiResponse';
import { IUser } from 'src/user/user.interface';
import { UserDocument } from 'src/user/user.schema';
import { SignupResponseModel, LoginResponseModel } from './types';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): SignupResponseModel {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): LoginResponseModel {
    const token = await this.authService.login(loginUserDto);
    return this.authService.login(loginUserDto);
  }
}
