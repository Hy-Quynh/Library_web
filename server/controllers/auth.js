const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { userSignUp } = require("../models/auth");
const { getUserByEmail, getUserByUserName } = require("../models/user");

module.exports = {
  SIGNUP: asyncHandler(async (req, res) => {
    const { firstName, lastName, email, userName, password } = req.body;
    const userByEmail = await getUserByEmail(email);
  
    if (userByEmail?._id) {
      return res.send({ success: false, error: "Email đã tồn tại" });
    }

    const userByUrName = await getUserByUserName(userName);

    if (userByUrName?._id) {
      return res.send({ success: false, error: "Tên đăng nhập đã tồn tại" });
    }

    const signupResult = await userSignUp(
      firstName,
      lastName,
      email,
      userName,
      password
    );

    if (!signupResult) {
      return res.send({ success: false, error: "Đăng kí tài khoản thất bại" });
    }
    return res.send({ success: true });
  }),

  LOGIN: asyncHandler(async (req, res) => {
    try {
      const { userName, password } = req.body;

      const getUser = await getUserByUserName(userName);

      if (!getUser?._id) {
        return res.send({ success: false, error: "Email không tồn tại" });
      }

      const isMatchUser = bcrypt.compareSync(password, getUser?.password || "");

      if (!isMatchUser) {
        return res.send({ success: false, error: "Sai mật khẩu" });
      }

      return res.send({
        success: true,
        payload: { ...getUser },
      });
    } catch (error) {
      return res.send({ success: false, error: "Đăng nhập thất bại" });
    }
  }),
};
