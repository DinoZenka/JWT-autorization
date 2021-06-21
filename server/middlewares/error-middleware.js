const ApiErr = require('../exceptions/api-error')

module.exports = function (err, req, resp, next) {
  console.log(err);
  if (err instanceof ApiErr) {
    return resp.status(err.status).json({ message: err.message, errors: err.errors })
  }
  return resp.status(500).json({ message: "Uncovered error" })
}