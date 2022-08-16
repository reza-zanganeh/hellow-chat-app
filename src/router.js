const projectConfig = require("./config/index")
const appVersion = projectConfig.appVersion
const { errorHandler, notFoundResponse } = require("./helper/responseHandler")
// require routers
const authenticationRouter = require("./app/authentication/router")
const userRouter = require("./app/user/router")
const privateChatRouter = require("./app/privateChanel/router")
module.exports = (app) => {
  app.use(`${appVersion}/auth`, authenticationRouter)
  app.use(`${appVersion}/user`, userRouter)
  app.use(`${appVersion}/private-chat`, privateChatRouter)
  app.use("*", notFoundResponse)
  app.use(errorHandler)
}
