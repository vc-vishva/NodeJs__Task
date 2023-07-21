import { MyCustomResponse } from 'src/apiResponse';
import { PostDocument } from './post.schema';

export type createPostModel = Promise<MyCustomResponse<PostDocument>>;

export type getOnePostModel = Promise<MyCustomResponse<PostDocument>>;
export type getAllPostsModel = Promise<MyCustomResponse<PostDocument>>;
