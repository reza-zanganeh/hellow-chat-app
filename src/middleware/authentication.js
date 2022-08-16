const jwt = require("jsonwebtoken")
const projectConfig = require("../config/index")
const { createError } = require("../helper/Fn")

module.exports.isAuthenticate = async (req, res, next) => {
  const token = req.headers?.accesstoken
  try {
    const user = jwt.verify(token, projectConfig.serverConfig.tokenKey)
    req.user = user
    next()
  } catch (error) {
    next(
      createError({
        statusCode: 403,
        message: "you must login or register before this operation",
      })
    )
  }
}
