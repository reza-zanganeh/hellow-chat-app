const express = require("express")
const { checkSchema } = require("express-validator")
const {
  expressValidationResultHandler,
} = require("../../helper/responseHandler")
const userRouter = express.Router()
const { isAuthenticate } = require("../../middleware/authentication")
const userCotroller = require("./controller")
const validationSchema = require("./validationSchema")
userRouter.get(
  "/search-user",
  isAuthenticate,
  checkSchema(validationSchema.searchUser),
  expressValidationResultHandler,
  userCotroller.searchOnUsersByUsername
)

module.exports = userRouter
