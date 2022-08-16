const projectConfig = require("../../config/index")
const {
  createRandomNumber,
  createError,
  createJsonWebToken,
} = require("../../helper/Fn")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { sendOtpCode, sendResetPasswordHash } = require("../../service/nodemail")
const responseMessage = require("../../helper/responseMessage")
const dataLogic = require("./dataLogic")
const arvanCloud = require("../../service/arvanCloud")
const { resposeHandler } = require("../../helper/responseHandler")
const {
  setOnRedis,
  getFromRedis,
  getTtlFromRedis,
} = require("../../service/redis")

module.exports.requestOtpToEmail = async (req, res, next) => {
  try {
    const { email } = req.body
    // check email to not regsitered before
    const userIsExists = await dataLogic.findUserByEmail(email)

    if (userIsExists) return next(createError(responseMessage.error.userExists))

    const redisKey = `otpReq : ${email}`
    const requestRemainTime = await getTtlFromRedis(redisKey)
    const otpRequestIsActiveForUser = requestRemainTime !== -2

    if (otpRequestIsActiveForUser)
      return next(
        createError(
          responseMessage.error.timeLimitRequest("otp", requestRemainTime)
        )
      )

    // 10000 -  100000
    const randomCode = createRandomNumber(
      projectConfig.otpConfig.length.min,
      projectConfig.otpConfig.length.max
    )

    const saveOtpOnRedisResult = await setOnRedis(
      redisKey,
      randomCode,
      projectConfig.otpConfig.expiresTime
    )
    // send email to admin to test redis server is ok
    if (!saveOtpOnRedisResult)
      return next(
        createError(responseMessage.error.serviceNotWorked("otp request"))
      )

    sendOtpCode(email, randomCode)

    const token = createJsonWebToken(
      {
        email,
        randomCode,
      },
      projectConfig.otpConfig.expiresTime
    )

    resposeHandler(
      res,
      {
        token,
        expiresIn: projectConfig.otpConfig.expiresTime * 60000,
      },
      responseMessage.success.successFullOperation("otp request")
    )
  } catch (error) {
    // send email to admin to check for this error
    return next(
      createError(responseMessage.error.serviceNotWorked("otp request"))
    )
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

    const redisKey = `otpReq : ${email}`

    const code = await getFromRedis(redisKey)

    if (!code || !otpCode)
      return next(createError(responseMessage.error.verifyOtpNotExistCode))

    if (otpCode != code) {
      return next(createError(responseMessage.error.invalidField("otp code")))
    }
    if (
      profilePictureType &&
      (profilePictureType !== "png" || profilePictureType !== "jpeg")
    )
      return next(
        createError(
          responseMessage.error.invalidField(
            "profile picture type ( valid value : jpeg | png )"
          )
        )
      )

    if (profilePictureSize && +profilePictureSize > 128)
      return next(
        createError(
          responseMessage.error.invalidField(
            "profile picture size ( must be less than  128 kb )"
          )
        )
      )

    const newUser = await dataLogic.createUser({
      email,
      username,
      fullname,
      password,
      profilePictureType,
      bio,
    })

    const token = createJsonWebToken(
      {
        id: newUser.id,
        username,
        email,
      },
      projectConfig.serverConfig.authenticationTokenExpiresTime
    )

    let presignedUrl = ""
    if (profilePictureType) {
      presignedUrl = arvanCloud.getPresignedUrlToUploadProfilePicture(
        newUser.id,
        profilePictureType
      )
    }

    resposeHandler(
      res,
      {
        token,
        presignedUrl,
        expiresIn: projectConfig.otpConfig.expiresTime * 60000,
        profilePictureSrc: `${projectConfig.serviceConfig.arvanCloud.endPointUrl}/${projectConfig.serviceConfig.arvanCloud.bucket}/${newUser.profilePictureSrc}`,
      },
      responseMessage.success.successFullOperation("register")
    )
  } catch (error) {
    if (error.code == "P2002") {
      return next(createError(responseMessage.error.userIsExists))
    }
    next(createError(responseMessage.error.faildOperation("register")))
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
    const token = createJsonWebToken(
      {
        id: user.id,
        username,
        email: user.email,
      },
      projectConfig.serverConfig.authenticationTokenExpiresTime
    )
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
      responseMessage.success.successFullOperation("login")
    )
  } catch (error) {
    next(createError(responseMessage.error.faildOperation("login")))
  }
}

module.exports.requestToResetPassword = async (req, res, next) => {
  try {
    const redirectUrl = req.body?.redirectUrl
    const { username } = req.body
    if (!username)
      return next(createError(responseMessage.error.emptyField("username")))

    // check email to not regsitered before
    const user = await dataLogic.findUserByUsername(username)
    if (!user) return next(createError(responseMessage.error.userNotExists))

    const userId = user.id

    const redisKey = `resetPassReq : ${userId}`

    const requestRemainTime = await getTtlFromRedis(redisKey)
    const resetPasswordRequestIsActiveForUser = requestRemainTime !== -2

    if (resetPasswordRequestIsActiveForUser)
      return next(
        createError(
          responseMessage.error.timeLimitRequest(
            "request to reset password",
            requestRemainTime
          )
        )
      )

    const hash = crypto.randomBytes(32).toString("hex")
    const saveResetPasswordCodeOnRedisResult = await setOnRedis(
      redisKey,
      hash,
      projectConfig.otpConfig.expiresTime
    )
    // send email to admin to test redis server is ok
    if (!saveResetPasswordCodeOnRedisResult)
      return next(
        createError(
          responseMessage.error.serviceNotWorked("request to reset password")
        )
      )

    sendResetPasswordHash(user.email, userId, hash, redirectUrl)
    resposeHandler(
      res,
      {},
      responseMessage.success.successFullOperation("request to reset password")
    )
  } catch (error) {
    // send email to admin to check for this error
    return next(
      createError(responseMessage.error.serviceNotWorked("reset password"))
    )
  }
}

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { userId, hash } = req.params

    const redisKey = `resetPassReq : ${userId}`
    const savedHash = await getFromRedis(redisKey)
    if (!savedHash || savedHash !== hash)
      return next(
        createError(
          responseMessage.error.faildOperation(
            "reset password ( hash expired )"
          )
        )
      )

    const { newPassword, confirmNewPassword } = req.body

    if (newPassword !== confirmNewPassword)
      return next(
        createError(
          responseMessage.error.notEqual("password", "confirm password")
        )
      )

    await dataLogic.updatePasswordByUserId(userId, newPassword)

    resposeHandler(
      res,
      {},
      responseMessage.success.successFullOperation("reset password")
    )
  } catch (error) {
    next(createError(responseMessage.error.faildOperation("reset password")))
  }
}
