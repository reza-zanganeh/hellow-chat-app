const projectConfig = require("../../config/index")
module.exports = {
  error: {
    inValidOrEmptyEmail: {
      statusCode: 400,
      message: "your email is invalid or not providen",
    },
    otpRequestNotWorked: {
      statusCode: 503,
      message: "otp request not work . please try again later",
    },
    verifyOtpNotExistCode: {
      statusCode: 400,
      message:
        "you must first request to get otp code or your otp code is expired",
    },
    invalidOtpCode: {
      statusCode: 400,
      message: "otp code is invalid",
    },
    otpTimeLimitRequest: {
      statusCode: 400,
      message: `you have active otp request for this email . please wait ${projectConfig.otpConfig.expiresTime} minute`,
    },
    invalidProfilePictureType: {
      statusCode: 400,
      message: "profile picture type must be png or jpeg",
    },
    invalidProfilePictureSize: {
      statusCode: 400,
      message: "profile picture size must be less than 128 k",
    },
    userExists: {
      statusCode: 400,
      message: "you are registered before please login",
    },
    registerFail: {
      statusCode: 400,
      message: "register faild . please check your input data and try again",
    },
    userIsExists: {
      statusCode: 400,
      message: "this email or username registered before please check ",
    },
    loginFaild: {
      statusCode: 400,
      message: "login faild , username or password is invalid",
    },
  },
  success: {
    successFullOtpRequest: {
      statusCode: 200,
      message: "otp request is successfull",
    },
    successFullRegister: {
      statusCode: 200,
      message: "register is successfull",
    },
    successFullLogin: {
      statusCode: 200,
      message: "login is successfull",
    },
  },
}
