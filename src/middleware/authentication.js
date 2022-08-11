const jwt = require("jsonwebtoken")
const config = require("../config")
module.exports.isAuthenticate = async (req, res, next) => {
  const token = req.headers?.accesstoken
  try {
    const user = jwt.verify(token, config.TOKEN_KEY)
    req.user = user
    next()
  } catch (error) {
    error.errorType = "Unauthorized"
    next(error)
  }
}
