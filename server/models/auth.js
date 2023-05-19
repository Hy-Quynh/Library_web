const { mysql } = require("../config/mysql");
const bcrypt = require("bcrypt");

module.exports = {
  userSignUp: async (firstName, lastName, email, userName, password) => {
    try {
      const hash = bcrypt.hashSync(password, 10);
      const signupRes = await mysql.query(
        `INSERT INTO users(first_name, last_name, email, user_name, password, created_day, status) VALUES('${firstName}', '${lastName}', '${email}', '${userName}', '${hash}', Now(), 1)`
      );
      if (signupRes) return true;

      return false;
    } catch (error) {
      console.log("user sign up error >>>> ", error);
      return false;
    }
  },
};
