const projectConfig = require("./config/index")
const express = require("express")
const cors = require("cors")
const { createServer } = require("http")
const createSocketServer = require("./socket.io/app")
const registerRoutes = require("./router")
const app = express()
app.use(
  cors({
    origin: projectConfig.serverConfig.cors.origin,
    credentials: projectConfig.serverConfig.cors.credentials,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    exposedHeaders: ["accesstoken"],
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "server is running , you can use it" })
})
// register routers
registerRoutes(app)
const httpServer = createServer(app)
createSocketServer(httpServer)
const PORT = projectConfig.serverConfig.httpServer.port || 3000
httpServer.listen(PORT, () => {
  console.log(`server is running on ${PORT}`)
})
