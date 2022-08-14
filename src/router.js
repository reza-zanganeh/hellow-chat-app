const projectConfig = require("./config/index")
const appVersion = projectConfig.appVersion
const { errorHandler, notFoundResponse } = require("./helper/responseHandler")
// require routers
const authenticationRouter = require("./app/authentication/router")

module.exports = (app) => {
  app.use(`${appVersion}/auth`, authenticationRouter)
  app.use("*", notFoundResponse)
  app.use(errorHandler)
}
