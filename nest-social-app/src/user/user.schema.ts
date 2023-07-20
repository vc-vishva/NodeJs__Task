import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema()
export class User {
  _id: Types.ObjectId;

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

  @Prop({ type: Boolean, default: false })
  logoutAll: boolean;
}

// export type UserDocument = User & Document;

export type UserDocument = Document<User>;
export const UserSchema = SchemaFactory.createForClass(User);
