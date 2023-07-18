import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentDto {
  @IsString()
  comment: string;

  @IsString()
  userId: string;

  @IsString()
  mentions: string;

  @IsNotEmpty()
  createdAt: Date;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['private', 'public'])
  category: string;

  @IsNotEmpty()
  sharedUsers: string[];

  @IsNotEmpty()
  mentions: string[];

  @IsNotEmpty()
  createdAt: Date;

  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  comments: CommentDto[];
}

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['private', 'public'])
  category: string;

  @IsNotEmpty()
  sharedUsers: string[];

  @IsNotEmpty()
  mentions: string[];

  @IsNotEmpty()
  createdAt: Date;

  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  comments: CommentDto[];
}
