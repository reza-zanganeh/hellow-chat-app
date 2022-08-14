const { error: errorMessage } = require("./responseMessage")
const email = (location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: errorMessage.emptyField("email").message,
  },
  isEmail: {
    bail: true,
    errorMessage: errorMessage.invalidField("email").message,
  },
})

const password = (fieldName, location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: errorMessage.emptyField(fieldName).message,
  },
  isLength: {
    errorMessage: errorMessage.limitLength(fieldName, 6).message,
    options: { min: 6 },
  },
})

const username = (location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: errorMessage.emptyField("username").message,
  },
  isLength: {
    errorMessage: errorMessage.limitLength("username", 5),
    options: { min: 5 },
  },
})

const required = (fieldName, location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: errorMessage.emptyField(fieldName).message,
    checkNull: true,
  },
})

module.exports.requestOtpToEmail = {
  email: email("body"),
}

module.exports.register = {
  email: email("body"),
  password: password("password", "body"),
  fullname: required("fullname", "body"),
  username: username("body"),
}

module.exports.login = {
  username: username("body"),
  password: password("password", "body"),
}

module.exports.forgetPassword = {
  username: username("body"),
}

module.exports.resetPassword = {
  newPassword: password("newPassword", "body"),
  confirmNewPassword: password("confirmNewPassword", "body"),
}
