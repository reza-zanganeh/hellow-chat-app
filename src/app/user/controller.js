const projectConfig = require("../../config/index")
const {
  createRandomNumber,
  createError,
  createJsonWebToken,
} = require("../../helper/Fn")
const bcrypt = require("bcrypt")
const { sendOtpCode } = require("../../service/nodemail")
const responseMessage = require("./responseMessage")
const dataLogic = require("./dataLogic")
const arvanCloud = require("../../service/arvanCloud")
const { resposeHandler } = require("../../helper/responseHandler")
const { setOnRedis, getFromRedis } = require("../../service/redis")

module.exports.requestOtpToEmail = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email)
      return next(createError(responseMessage.error.inValidOrEmptyEmail))

    // check email to not regsitered before
    const userIsExists = await dataLogic.findUserByEmail(email)

    if (userIsExists) return next(createError(responseMessage.error.userExists))

    const otpRequestIsActiveForUser = await getFromRedis(email)

    if (otpRequestIsActiveForUser)
      return next(createError(responseMessage.error.otpTimeLimitRequest))

    // 10000 -  100000
    const randomCode = createRandomNumber(
      projectConfig.otpConfig.length.min,
      projectConfig.otpConfig.length.max
    )

    await sendOtpCode(email, randomCode)

    const saveOtpOnRedisResult = await setOnRedis(
      email,
      randomCode,
      projectConfig.otpConfig.expiresTime
    )
    // send email to admin to test redis server is ok
    if (!saveOtpOnRedisResult)
      return next(createError(responseMessage.error.otpRequestNotWorked))

    const token = createJsonWebToken({
      email,
      randomCode,
    })

    resposeHandler(
      res,
      {
        token,
        expiresIn: projectConfig.otpConfig.expiresTime * 60000,
      },
      responseMessage.success.successFullOtpRequest
    )
  } catch (error) {
    // send email to admin to check for this error
    return next(createError(responseMessage.error.otpRequestNotWorked))
  }
}

module.exports.register = async (req, res, next) => {
  try {
    const {
      email,
      username,
      fullname,
      password,
      profilePictureType,
      profilePictureSize,
      bio,
      otpCode,
    } = req.body

    const code = await getFromRedis(email)

    if (!code || !otpCode)
      return next(createError(responseMessage.error.verifyOtpNotExistCode))

    if (otpCode != code) {
      console.log(otpCode != code)
      return next(createError(responseMessage.error.invalidOtpCode))
    }
    if (
      profilePictureType &&
      (profilePictureType !== "png" || profilePictureType !== "jpeg")
    )
      return next(createError(responseMessage.error.invalidProfilePictureType))

    if (profilePictureSize && +profilePictureSize > 128)
      return next(createError(responseMessage.error.invalidProfilePictureSize))

    const newUser = await dataLogic.createUser({
      email,
      username,
      fullname,
      password,
      profilePictureType,
      bio,
    })

    const token = createJsonWebToken({
      id: newUser.id,
      username,
      email,
    })

    let presignedUrl = ""
    if (profilePictureType) {
      presignedUrl = arvanCloud.getPresignedUrlToUploadProfilePicture(
        newUser.id,
        profilePictureType
      )
    }
    // else
    // send user token
    resposeHandler(
      res,
      {
        token,
        presignedUrl,
        expiresIn: projectConfig.otpConfig.expiresTime * 60000,
        profilePictureSrc: `${projectConfig.serviceConfig.arvanCloud.endPointUrl}/${projectConfig.serviceConfig.arvanCloud.bucket}/${newUser.profilePictureSrc}`,
      },
      responseMessage.success.successFullRegister
    )
  } catch (error) {
    if (error.code == "P2002") {
      return next(createError(responseMessage.error.userIsExists))
    }
    next(createError(responseMessage.error.registerFail))
  }
}

module.exports.login = async (req, res, next) => {
  try {
    // find user with email
    const { username, password: inputPassword } = req.body
    const user = await dataLogic.findUserByUsername(username)
    const password = user.password
    const resultOfcomparePassword = await bcrypt.compare(
      inputPassword,
      password
    )

    if (!resultOfcomparePassword) {
      return next(createError(responseMessage.error.loginFaild))
    }
    // if true create and send token
    const token = createJsonWebToken({
      id: user.id,
      username,
      email: user.email,
    })
    // 7. send token in response
    resposeHandler(
      res,
      {
        token,
        expiresIn: projectConfig.otpConfig.expiresTime * 60000,
        username,
        fullname: user.fullname,
        profilePictureSrc: `${projectConfig.serviceConfig.arvanCloud.endPointUrl}/${projectConfig.serviceConfig.arvanCloud.bucket}/${user.profilePictureSrc}`,
      },
      responseMessage.success.successFullLogin
    )
  } catch (error) {
    console.log(error)
    next(createError(responseMessage.error.loginFaild))
  }
}
