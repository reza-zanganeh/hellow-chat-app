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
  this.resposeHandler(res, {}, 404, "Not Found")
}
