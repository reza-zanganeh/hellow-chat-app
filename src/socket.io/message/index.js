module.exports = (Socket) => {
  Socket.on("connection", () => {
    console.log("user connected to message namespace")
  })
}
