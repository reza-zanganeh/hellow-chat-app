const { createError } = require("../../helper/Fn")
const { resposeHandler } = require("../../helper/responseHandler")
const responseMessage = require("../../helper/responseMessage")
const dataLogic = require("./dataLogic")
module.exports.createPrivateChat = async (req, res, next) => {
  try {
    const starterUserId = req.user.id
    const { reciverUserId } = req.body

    const reciverUser = await dataLogic.findUserById(reciverUserId)
    if (!reciverUser)
      return next(
        createError(
          responseMessage.error.faildOperation(
            "create private chat ( reciver user not found )"
          )
        )
      )
    let privateChat = await dataLogic.findPrivateChatByUsersId(
      starterUserId,
      reciverUserId
    )
    if (!privateChat) {
      privateChat = await dataLogic.createPrivateChat(
        starterUserId,
        reciverUserId
      )
    }
    resposeHandler(
      res,
      privateChat,
      responseMessage.success.successFullOperation(
        "create | get private chat data"
      )
    )
  } catch (error) {
    next(
      createError(responseMessage.error.faildOperation("create private chat"))
    )
  }
}

module.exports.sendTextMessageToPrivateChat = async (req, res, next) => {
  try {
    const senderId = req.user.id
    const { context, privateChatId } = req.body
    const newMessage = await dataLogic.createMessageInPrivateChat(
      context,
      "TEXT",
      senderId,
      privateChatId
    )

    resposeHandler(
      res,
      newMessage,
      responseMessage.success.successFullOperation(
        "send message to private chat"
      )
    )
  } catch (error) {
    next(
      createError(responseMessage.error.faildOperation("create private chat"))
    )
  }
}

module.exports.getMyPrivateChat = async (req, res, next) => {
  try {
    const { id } = req.user
    console.log(id)
    const privateChat = await dataLogic.getMyPrivateChat(id)
    resposeHandler(
      res,
      privateChat,
      responseMessage.success.successFullOperation("get my private chat")
    )
  } catch (error) {
    console.log(error)
    next(
      createError(responseMessage.error.faildOperation("get my private chat"))
    )
  }
}

module.exports.getPrivateChatById = async (req, res, next) => {
  try {
    const { privateChatId } = req.params
    const { id } = req.user
    const privateChat = await dataLogic.getPrivateChatByIdAndUserId(
      privateChatId,
      id
    )
    resposeHandler(
      res,
      privateChat,
      responseMessage.success.successFullOperation("get private chat")
    )
  } catch (error) {
    console.log(error)
    next(createError(responseMessage.error.faildOperation("get private chat")))
  }
}
