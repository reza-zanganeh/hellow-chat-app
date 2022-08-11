const jwt = require("jsonwebtoken")
const projectConfig = require("../config/index")
const { createError } = require("../helper/Fn")
module.exports.isValidVerifyOtpToken = async (req, res, next) => {
  const token = req.headers?.accesstoken
  try {
    const { email } = jwt.verify(token, projectConfig.serverConfig.tokenKey)
    req.body.email = email
    next()
  } catch (error) {
    return next(
      createError({ statusCode: 400, message: "you must send valid otp token" })
    )
  }
}
