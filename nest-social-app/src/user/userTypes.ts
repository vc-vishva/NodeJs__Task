import { MyCustomResponse } from 'src/apiResponse';
import { UserDocument } from 'src/user/user.schema';

export type UserUpdateModel = Promise<MyCustomResponse<UserDocument>>;
export type changePasswordModel = Promise<MyCustomResponse<UserDocument>>;
export type getUserProfileModel = Promise<MyCustomResponse<UserDocument>>;
