const { Server } = require("socket.io")
const projectConfig = require("../config/index")
const messageNamespaceHandler = require("./message/index")
module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: projectConfig.serverConfig.cors.origin,
      credentials: projectConfig.serverConfig.cors.credentials,
    },
  })

  io.of("/message").on("connection", messageNamespaceHandler)
}
