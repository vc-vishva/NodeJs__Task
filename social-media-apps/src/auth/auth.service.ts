import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { CreateUserDto, LoginUserDto } from '../user/createUser.Dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { name, email, phoneNo, password } = createUserDto;

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

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid username or password');
    }

    const payload = {
      userId: user._id,
    };

    const token = this.jwtService.sign(payload);
    return token;
  }

  //   async login(credentials: any) {
  //     // Implement login logic, e.g., verify the user's credentials from the database
  //     // Return a JWT token upon successful login or handle authentication failure
  //   }

  //   async verifyToken(token: string) {
  //     // Verify the JWT token and return the decoded payload
  //     try {
  //       return this.jwtService.verify(token);
  //     } catch (error) {
  //       // Handle token verification failure, e.g., return an error message or throw an exception
  //     }
  //   }
}
