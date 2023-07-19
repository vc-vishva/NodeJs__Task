import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { CreateUserDto, LoginUserDto } from '../user/createUser.Dto';
import * as bcrypt from 'bcrypt';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
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

    return { message: 'User signup successful' };
  }
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid username or password');
    }
    console.log(user, 'userrr');

    const payload = {
      userId: user._id,
    };

    console.log(user._id, 'sdfghjsadfg');
    console.log(payload.userId, 'payload idddddd');

    const token = this.jwtService.sign(payload);
    return token;
  }
}
