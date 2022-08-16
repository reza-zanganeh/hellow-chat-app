const { required } = require("../../helper/validationSchema")

module.exports.getPrivateChat = {
  reciverUserId: required("reciverUserId", "body"),
}

module.exports.sendMessageToPrivateChat = {
  context: required("context", "body"),
  privateChatId: required("privateChatId", "body"),
}

module.exports.getPrivateChat = {
  privateChatId: required("privateChatId", "params"),
}
