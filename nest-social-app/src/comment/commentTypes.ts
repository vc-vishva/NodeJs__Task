import { MyCustomResponse } from 'src/apiResponse';
import { PostDocument } from 'src/post/post.schema';

export type createCommentModel = Promise<MyCustomResponse<PostDocument>>;
