const { createError } = require("../../helper/Fn")
const { resposeHandler } = require("../../helper/responseHandler")
const responseMessage = require("../../helper/responseMessage")
const dataLogic = require("./dataLogic")
module.exports.searchOnUsersByUsername = async (req, res, next) => {
  try {
    const { username } = req.query
    const users = await dataLogic.searchOnUsersByUsername(username)
    resposeHandler(
      res,
      { users, searchQuery: username, count: users.length },
      responseMessage.success.successFullOperation(
        "search on users with username"
      )
    )
  } catch (error) {
    return next(
      createError(
        responseMessage.error.faildOperation("search on users with username")
      )
    )
  }
}
