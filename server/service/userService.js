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

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.badRequest(`User with email ${email} doesn't found`);
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw ApiError.badRequest('Incorrect password');
    }
    const userDTO = new UserDTO(user);

    const tokens = await tokenService.generateTokens({ ...userDTO });

    await tokenService.saveToken(userDTO.id, tokens.refreshToken);
    return { ...tokens, user: userDTO }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unAutorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const token = await tokenService.findToken(refreshToken);
    if (!userData || !token) {
      throw ApiError.unAutorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDTO = new UserDTO(user);
    const tokens = await tokenService.generateTokens({ ...userDTO });

    await tokenService.saveToken(userDTO.id, tokens.refreshToken);
    return { ...tokens, user: userDTO }
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}
module.exports = new UserService();