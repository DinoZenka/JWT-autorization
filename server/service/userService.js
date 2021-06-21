const UserModel = require('../models/userModel');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const tokenService = require('./tokenService');
const mailService = require('./mailService');
const UserDTO = require('../dtos/userDTO');
const ApiError = require('../exceptions/api-error');

class UserService {
  async registration(email, password) {

    var checkMail = await UserModel.findOne({ email });

    if (checkMail) {
      throw ApiError.badRequest(`email ${email} is already registered`);
    }
    var activationLink = uuid.v4();
    var hashPasw = await bcrypt.hash(password, 3);


    var user = await UserModel.create({ email, password: hashPasw, activationLink });

    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    var userDTO = new UserDTO(user); //id, mail, isActivated
    var tokens = await tokenService.generateTokens({ ...userDTO });

    await tokenService.saveToken(userDTO.id, tokens.refreshToken);

    return { ...tokens, user: userDTO }

  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.badRequest('Invalid activation link');
    }

    user.isActivated = true;
    await user.save();
  }
}
module.exports = new UserService();