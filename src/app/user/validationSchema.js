const { required } = require("../../helper/validationSchema")

module.exports.searchUser = {
  username: required("username", "query"),
}
