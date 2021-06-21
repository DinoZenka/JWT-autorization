const userService = require('../service/userService');

class UserController {

  async registration(req, resp, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);

      // 30 days in milliseconds
      // httpOnly - disable to change and get cookie inside the browser using JS
      resp.cookie('refresh', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      return resp.json(userData);
    } catch (error) {
      console.log(error)
    }
  }

  async login(req, resp, next) {
    try {

    } catch (error) {

    }
  }
  async logout(req, resp, next) {
    try {

    } catch (error) {

    }
  }
  async activate(req, resp, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return resp.redirect(process.env.CLIENT_URL);
    } catch (error) {
      console.log(error)
    }
  }
  async refresh(req, resp, next) {
    try {

    } catch (error) {

    }
  }
  async getUsers(req, resp, next) {
    try {
      resp.json(['asdsd', 'asdsd'])
    } catch (error) {

    }
  }

}

module.exports = new UserController();