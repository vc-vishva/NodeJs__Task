import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phoneNo?: string;

  @Prop()
  password: string;

  @Prop({ required: true, unique: true })
  username: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
