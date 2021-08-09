const express = require("express");
const createHttpError = require("http-errors");
const router = express.Router();
const User = require("../Models/user.model");
const { loginSchema, registerSchema } = require("../Helpers/validation_schema");
const { signAccessToken, signRefreshToken } = require("../Helpers/jwt_helper");

router.post("/register", async (req, res, next) => {
  try {
    const check = await registerSchema.validateAsync(req.body);
    const emailExist = await User.findOne({ email: check.email }); //check email exist or not
    if (emailExist) throw createHttpError.Conflict("Email already exists!");

    const user = new User(check);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    res
      .status(200)
      .send({
        accessToken,
        refreshToken,
        message: "You have successfully registered",
      });
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const check = await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ email: check.email });
    if (!user) throw createHttpError.NotFound("User not exist!");
    if (check.password !== user.password)
      throw createHttpError.Unauthorized("Username or password invalid!");
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    res
      .status(200)
      .send({
        accessToken,
        refreshToken,
        message: "You have successfully logged in",
      });
  } catch (err) {
    if (err.isJoi === true)
      return next(createHttpError.BadRequest("Username or password invalid!"));
    next(err);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  res.send("refresh token");
});

router.delete("/logout", async (req, res, next) => {
  res.send("delete user");
});

module.exports = router;
