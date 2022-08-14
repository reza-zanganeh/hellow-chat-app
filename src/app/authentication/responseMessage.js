module.exports = {
  error: {
    emptyField(fieldName) {
      return {
        statusCode: 400,
        message: `${fieldName} not providen`,
      }
    },
    invalidField(fieldName) {
      return {
        statusCode: 400,
        message: `your ${fieldName} is invalid`,
      }
    },
    serviceNotWorked(serviceName) {
      return {
        statusCode: 503,
        message: `${serviceName} not work . please try again later`,
      }
    },
    timeLimitRequest(requestName, remainTime) {
      return {
        statusCode: 400,
        message: `you have active ${requestName} request for this email . please wait ${
          remainTime / 60
        } minute`,
      }
    },
    faildOperation(operationName) {
      return {
        statusCode: 400,
        message: `${operationName} faild . please check your input data and try again`,
      }
    },
    limitLength(fieldName, min, max) {
      if (min && max)
        return {
          statusCode: 400,
          message: `${fieldName} length must be between ${min} & ${max}`,
        }
      if (min)
        return {
          statusCode: 400,
          message: `${fieldName} length must be at least ${min}`,
        }
      else
        return {
          statusCode: 400,
          message: `${fieldName} length must be less than ${max}`,
        }
    },
    notEqual(fieldNameOne, fieldNameTwo) {
      return {
        statusCode: 400,
        message: `${fieldNameOne} not equal ${fieldNameTwo}`,
      }
    },
    userExists: {
      statusCode: 400,
      message: "you are registered before please login",
    },
    userIsExists: {
      statusCode: 400,
      message: "this email or username registered before please check ",
    },
    userNotExists: {
      statusCode: 400,
      message: "this username not registered before please register",
    },
    verifyOtpNotExistCode: {
      statusCode: 400,
      message:
        "you must first request to get otp code or your otp code is expired",
    },
  },
  success: {
    successFullOperation(operationName) {
      return {
        statusCode: 200,
        message: `${operationName} is successfull`,
      }
    },
  },
}
