import { MyCustomResponse } from 'src/apiResponse';
import { UserDocument } from 'src/user/user.schema';

export type SignupResponseModel = Promise<MyCustomResponse<UserDocument>>;

export class LoginResponseData {
  token: string;
}
export type LoginResponseModel = Promise<MyCustomResponse<LoginResponseData>>;
