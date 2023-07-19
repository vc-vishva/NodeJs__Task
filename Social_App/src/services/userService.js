import User from '../models/users.js';

  const userService = {
     getUserByEmail: async (email) => {  try {
         const user = await User.findOne({ email });
         return user;
      } catch (error) {
        throw new Error('Failed to get user by email');
      }
     },
  };

  export default userService;