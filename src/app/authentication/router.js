const express = require("express")
const { checkSchema } = require("express-validator")
const {
  expressValidationResultHandler,
} = require("../../helper/responseHandler")
const authenticationRouter = express.Router()
const {
  isValidVerifyOtpToken,
} = require("../../middleware/isValidVerifyOtpToken")
const authCotroller = require("./controller")
const validationSchema = require("./validationSchema")
authenticationRouter.post(
  "/request-otp-to-email",
  checkSchema(validationSchema.requestOtpToEmail),
  expressValidationResultHandler,
  authCotroller.requestOtpToEmail
)

authenticationRouter.post(
  "/register",
  isValidVerifyOtpToken,
  checkSchema(validationSchema.register),
  expressValidationResultHandler,
  authCotroller.register
)

authenticationRouter.post(
  "/login",
  checkSchema(validationSchema.login),
  expressValidationResultHandler,
  authCotroller.login
)
// forget | reset password
authenticationRouter.post(
  "/forget-password",
  checkSchema(validationSchema.forgetPassword),
  expressValidationResultHandler,
  authCotroller.requestToResetPassword
)

authenticationRouter.post(
  "/reset-password/:userId/:hash",
  checkSchema(validationSchema.resetPassword),
  expressValidationResultHandler,
  authCotroller.resetPassword
)

module.exports = authenticationRouter
