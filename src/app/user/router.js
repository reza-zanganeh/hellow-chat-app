const express = require("express")
const userRouter = express.Router()
const {
  isValidVerifyOtpToken,
} = require("../../middleware/isValidVerifyOtpToken")
const userController = require("./controller")
userRouter.post("/request-otp-to-email", userController.requestOtpToEmail)
userRouter.post("/register", isValidVerifyOtpToken, userController.register)
userRouter.post("/login", userController.login)
module.exports = userRouter
