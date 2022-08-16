const express = require("express")
const { checkSchema } = require("express-validator")
const {
  expressValidationResultHandler,
} = require("../../helper/responseHandler")
const privateChatRouter = express.Router()
const { isAuthenticate } = require("../../middleware/authentication")
const privateChatCotroller = require("./controller")
const validationSchema = require("./validationSchema")

privateChatRouter.get(
  "/",
  isAuthenticate,
  privateChatCotroller.getMyPrivateChat
)

privateChatRouter.get(
  "/:privateChatId",
  isAuthenticate,
  checkSchema(validationSchema.getPrivateChat),
  expressValidationResultHandler,
  privateChatCotroller.getPrivateChatById
)

privateChatRouter.post(
  "/",
  isAuthenticate,
  checkSchema(validationSchema.getPrivateChat),
  expressValidationResultHandler,
  privateChatCotroller.createPrivateChat
)

privateChatRouter.post(
  "/text-message-to-private-chat",
  isAuthenticate,
  checkSchema(validationSchema.sendMessageToPrivateChat),
  expressValidationResultHandler,
  privateChatCotroller.sendTextMessageToPrivateChat
)

module.exports = privateChatRouter
