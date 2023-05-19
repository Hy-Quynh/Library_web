const { mysql } = require("../config/mysql");

module.exports = {
  getUserByEmail: async (email) => {
    try {
      const user = await mysql.query(
        `SELECT _id, first_name, last_name, email, user_name, password, status, created_day, phone_number, address FROM users WHERE email='${email}'`
      );
      if (user?.length) {
        return user?.[0];
      }
      return {};
    } catch (error) {
      console.log("get user by email error >>>> ", error);
      return {};
    }
  },

  getUserByUserName: async (userName) => {
    try {
      const user = await mysql.query(
        `SELECT _id, first_name, last_name, email, user_name, password, status, created_day, phone_number, address FROM users WHERE user_name='${userName}'`
      );
      if (user?.length) {
        return user?.[0];
      }
      return {};
    } catch (error) {
      console.log("get user by email error >>>> ", error);
      return {};
    }
  },
};
