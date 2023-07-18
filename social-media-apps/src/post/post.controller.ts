import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './createPost.Dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    const { authenticatedUser } = req;
    const userId = authenticatedUser.id;
    createPostDto.userId = userId;
    return this.postService.createPost(createPostDto);
  }
}
