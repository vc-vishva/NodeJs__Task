import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { CommentDto } from 'src/post/createPost.Dto';
import { Post, PostDocument } from 'src/post/post.schema';
import mongoose from 'mongoose';
import { userInfo } from 'os';
import { createCommentModel } from './commentTypes';
import { createResponse } from 'src/apiResponse';
import { create } from 'domain';
const { ObjectId } = mongoose.Types;

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async createComment(
    postId: string,
    commentDto: CommentDto,
  ): createCommentModel {
    const post: Post = await this.postModel.findById(postId);
    if (!post) {
      return createResponse(false, HttpStatus.NOT_FOUND, 'not found post');
    }

    if (
      post.category === 'private' &&
      !post.sharedUsers.includes(new Types.ObjectId(commentDto.userId)) &&
      new Types.ObjectId(post.userId) == new Types.ObjectId(commentDto.userId)
    ) {
      console.log(post.userId, commentDto.userId);

      return createResponse(
        false,
        HttpStatus.BAD_REQUEST,
        'Unauthorized to access comments',
      );
    }

    const comment = {
      comment: commentDto.comment,
      userId: commentDto.userId,
      mentions: commentDto.mentions,
      createdAt: commentDto.createdAt,
    };

    post.comments.push(comment);
    //  await this.postModel.save()

    const data = await this.postModel.updateOne(
      { _id: postId },
      { $push: { comments: comment } },
    );
    console.log(data);

    return createResponse(true, HttpStatus.OK, 'okk', comment);
  }
}
