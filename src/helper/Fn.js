const jwt = require("jsonwebtoken")
const projectConfig = require("../config/index")
module.exports.createRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

module.exports.createError = ({ statusCode, message }) => {
  const error = new Error()
  error.statusCode = statusCode
  error.message = message
  return error
}

module.exports.createJsonWebToken = (data) => {
  const token = jwt.sign(data, projectConfig.serverConfig.tokenKey, {
    expiresIn: `${projectConfig.otpConfig.expiresTime}m`,
  })
  return token
}
