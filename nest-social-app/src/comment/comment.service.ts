import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { CommentDto } from 'src/post/createPost.Dto';
import { Post, PostDocument } from 'src/post/post.schema';
import mongoose from 'mongoose';
import { userInfo } from 'os';
const { ObjectId } = mongoose.Types;

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async createComment(postId: string, commentDto: CommentDto) {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new Error('Post not found');
    }
    if (
      post.category === 'private' &&
      !post.sharedUsers.includes(new Types.ObjectId(commentDto.userId))
    ) {
      throw new UnauthorizedException('Unauthorized to access comments');
    }

    const comment = {
      comment: commentDto.comment,
      userId: commentDto.userId,
      mentions: commentDto.mentions,
      createdAt: commentDto.createdAt,
    };

    post.comments.push(comment);

    await post.save();

    return comment;
  }
}
