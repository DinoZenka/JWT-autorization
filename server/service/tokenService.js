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
}
module.exports = new TokenService();