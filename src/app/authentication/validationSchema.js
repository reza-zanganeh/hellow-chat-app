const {
  email,
  password,
  required,
  username,
} = require("../../helper/validationSchema")
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
