import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './createPost.Dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Types, ObjectId } from 'mongoose';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Request() request, @Body() createPostDto: CreatePostDto) {
    const { authenticatedUser } = request;
    const userId = new Types.ObjectId(authenticatedUser.id);

    console.log(userId, '**********************8');

    createPostDto.userId = userId;
    return this.postService.createPost(createPostDto);
  }

  @Get('/:postId')
  async getOnePostByPostId(
    @Request() request,
    @Param('postId') Id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const postId = new Types.ObjectId(Id);
    const { authenticatedUser } = request;
    const userId = new Types.ObjectId(authenticatedUser.id);

    return this.postService.getOnePostByPostId(userId, postId, page, limit);
  }
  //
  @Get()
  async getAllPosts(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('searchedUserId') searchedUserId: string,
    @Query('searchText') searchText: string,
  ) {
    const { authenticatedUser } = request;
    const userId = new Types.ObjectId(authenticatedUser.id);
    return this.postService.getAllPosts(
      userId,
      page,
      limit,
      searchedUserId,
      searchText,
    );
  }
}
