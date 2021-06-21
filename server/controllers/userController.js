const userService = require('../service/userService');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error')
class UserController {

  async registration(req, resp, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest("Error during validation", errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);

      // 30 days in milliseconds
      // httpOnly - disable to change and get cookie inside the browser using JS
      resp.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      return resp.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req, resp, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      console.log(`----------------- ${userData} ----------------`)
      resp.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return resp.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async logout(req, resp, next) {
    try {

    } catch (error) {
      next(error);
    }
  }
  async activate(req, resp, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return resp.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }
  async refresh(req, resp, next) {
    try {

    } catch (error) {
      next(error);
    }
  }
  async getUsers(req, resp, next) {
    try {
      resp.json(['asdsd', 'asdsd'])
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new UserController();