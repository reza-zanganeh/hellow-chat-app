const { error: errorMessage } = require("./responseMessage")
module.exports.email = (location) => ({
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

module.exports.password = (fieldName, location) => ({
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

module.exports.username = (location) => ({
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

module.exports.required = (fieldName, location) => ({
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
