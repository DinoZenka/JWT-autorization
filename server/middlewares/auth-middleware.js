const ApiError = require('../exceptions/api-error');
const tokenSevice = require('../service/tokenService');

module.exports = function (req, resp, next) {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.unAutorizedError());
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.unAutorizedError());
    }
    const userData = tokenSevice.validateAccessToken(accessToken)

    if (!userData) {
      return next(ApiError.unAutorizedError());
    }

    req.user = userData;
    next();

  } catch (error) {
    console.log(`------------------4------------------------`)
    return next(ApiError.unAutorizedError())
  }
}