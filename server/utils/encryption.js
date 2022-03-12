const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const hashPasswordUsingBcrypt = (plainTextPassword) => {
  const { saltRounds } = config;

  try {
    return bcrypt.hashSync(plainTextPassword, saltRounds);
  } catch (error) {
    throw error;
  }
};

const comparePasswordUsingBcrypt = (plainTextPassword, passwordhash) =>
  bcrypt.compare(plainTextPassword, passwordhash);

const generateAuthToken = async (criteriaForJwt) => {
  const token = await jwt.sign(criteriaForJwt, config.jwtSecret);
  if (token) {
    try {
      return token;
    } catch (error) {
      throw error;
    }
  }
};

const findByToken = (token) => jwt.verify(token, config.jwtSecret);

module.exports = {
  hashPasswordUsingBcrypt,
  comparePasswordUsingBcrypt,
  generateAuthToken,
  findByToken,
};
