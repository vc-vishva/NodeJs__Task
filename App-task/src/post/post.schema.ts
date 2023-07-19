import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['private', 'public'], default: 'public' })
  category: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  sharedUsers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  mentions: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop([
    {
      comment: String,
      userId: { type: Types.ObjectId, ref: 'User' },
      mentions: { type: Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now },
    },
  ])
  comments: {
    comment: string;
    userId: string;
    mentions: string;
    createdAt: Date;
  }[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
