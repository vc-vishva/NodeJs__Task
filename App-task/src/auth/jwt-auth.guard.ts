import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from '../user/user.schema';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (token) {
      try {
        const payload = this.jwtService.verify(token);

        request.user = payload;
        console.log(request.user, 'reqxcvb n');

        const userId = payload.userId;
        console.log(userId, 'vvvvvvv');

        const user = await this.userModel.findById(userId);

        if (!user) {
          throw new UnauthorizedException('User not found');
        }

        request.authenticatedUser = user;
        console.log(request.authenticatedUser, '::::::::::::::::::::');

        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    throw new UnauthorizedException('No token provided');
  }
}
