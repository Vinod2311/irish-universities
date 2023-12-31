import { User } from "./user.js";

export const userMongoStore = {
  async getAllUsers() {
    const users = await User.find().lean();
    return users;
  },

  async getUserById(id) {
    if (id) {
      let user = await User.findOne({ _id: id }).lean();
      if (user === undefined) user = null;
      return user;
    }
    return null;
  },

  async addUser(user) {
    const newUser = new User(user);
    const userObj = await newUser.save();
    const u = await this.getUserById(userObj._id);
    return u;
  },

  async getUserByEmail(email) {
    let user = await User.findOne({ email: email }).lean();
    if (user === undefined) user = null;
    return user;
  },

  async deleteUserById(id) {
    try {
      await User.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAll() {
    await User.deleteMany({});
  },

  async updateUser(userId, updatedUser) {
    const userDoc = await User.findOne({ _id: userId });
    userDoc.firstName = updatedUser.firstName;
    userDoc.lastName = updatedUser.lastName;
    userDoc.email = updatedUser.email;
    await userDoc.save();
  },
};
