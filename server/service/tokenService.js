const jwt = require('jsonwebtoken');
const tokenModel = require('../models/tokenModel');

class TokenService {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const tok = await tokenModel.findOne({ user: userId });
    if (tok) {
      tok.refreshToken = refreshToken;
      return tok.save();
    }

    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }
  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.ACCESS_SECRET);
      return userData;
    } catch (error) {
      throw null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.REFRESH_SECRET);
      return userData;
    } catch (error) {
      throw null;
    }
  }

  async findToken(refreshToken) {
    const userData = await tokenModel.findOne({ refreshToken });
    return userData;
  }
}
module.exports = new TokenService();