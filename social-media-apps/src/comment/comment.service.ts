import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CommentDto } from 'src/post/createPost.Dto';
import { Post, PostDocument } from 'src/post/post.schema';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async createComment(postId: string, commentDto: CommentDto) {
    // const Id = new ObjectId(postId);
    // console.log(Id, 'IDDDDD');
    console.log(postId);

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new Error('Post not found');
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
