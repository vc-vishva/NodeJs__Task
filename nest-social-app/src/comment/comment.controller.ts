import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CommentDto } from '../post/createPost.Dto';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createCommentModel } from './commentTypes';

@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  async createPost(
    @Request() req,
    @Param('postId') PostId: string,
    @Body() commentDto: CommentDto,
  ): createCommentModel {
    const { authenticatedUser } = req;
    const userId = authenticatedUser.id;
    commentDto.userId = userId;
    return this.commentService.createComment(PostId, commentDto);
  }
}
