const { validationResult } = require("express-validator")

module.exports.errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "internal server error",
  })
}

module.exports.resposeHandler = (res, data, { statusCode, message }) => {
  res.status(statusCode).json({
    data: data || {},
    message,
  })
}

module.exports.notFoundResponse = (req, res, next) => {
  this.resposeHandler(res, {}, { statusCode: 404, message: "Route Not Found" })
}

module.exports.expressValidationResultHandler = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}
