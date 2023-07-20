import {
  Injectable,
  ConflictException,
  Response,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { IUser } from '../user/user.interface';
import { CreateUserDto, LoginUserDto } from '../user/createUser.Dto';
import * as bcrypt from 'bcrypt';
import { MyCustomResponse, createResponse } from 'src/apiResponse';
import { SignupResponseModel, LoginResponseModel } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // sign -up
  async signup(createUserDto: CreateUserDto): SignupResponseModel {
    const { name, email, phoneNo, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException(
        'Email already exists. Please use a different email.',
      );
    }

    const randomNumber = Math.floor(Math.random() * 10000);
    const username = `${name}${randomNumber}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      name,
      email,
      phoneNo,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return createResponse(
      true,
      HttpStatus.OK,
      'User created successfully',
      newUser,
    );
  }

  //login
  async login(loginUserDto: LoginUserDto): LoginResponseModel {
    const { email, password } = loginUserDto;

    const user: User = await this.userModel.findOne({ email });

    if (!user) {
      throw new Error('Invalid email or password');
    }
    console.log(user);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid username or password');
    }

    const payload = {
      userId: user._id,
    };

    const token = this.jwtService.sign(payload);
    return createResponse(true, HttpStatus.OK, 'success', [token]);
  }
}
