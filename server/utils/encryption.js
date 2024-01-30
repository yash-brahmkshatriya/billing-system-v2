const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * @function <b>hashPasswordUsingBcrypt</b><br>
 * Hash Password
 * @param {String} plainTextPassword Unsecured Password
 * @return {String} Secured Password
 */
const hashPasswordUsingBcrypt = (plainTextPassword) => {
  const { saltRounds } = config;

  try {
    return bcrypt.hash(plainTextPassword, saltRounds);
  } catch (error) {
    throw error;
  }
};

/**
 * @function <b>comparePasswordUsingBcrypt</b><br> Verify Password
 * @param {String} plainTextPassword Password to be checked
 * @param {String} passwordhash Hashed Password
 * @return {Boolean} True if match else False
 */
const comparePasswordUsingBcrypt = (plainTextPassword, passwordhash) =>
  bcrypt.compare(plainTextPassword, passwordhash);

/**
 * @function <b>generateAuthToken</b><br> Generate Token
 * @param {Object} criteriaForJwt keys for jwt to generate tokens
 * @return {String} Auth Token
 */

const generateAuthToken = (criteriaForJwt) => {
  const token = jwt.sign(criteriaForJwt, config.jwtSecret, {
    expiresIn: config.jwtExpiry,
  });
  return token;
};

/**
 * @function <b>findByToken</b><br> decrypt Token
 * @param {String} token token to be decrypt
 * @return {Object} payload if match returns user object else return null
 */
const findByToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (_) {}
  return null;
};
module.exports = {
  hashPasswordUsingBcrypt,
  comparePasswordUsingBcrypt,
  generateAuthToken,
  findByToken,
};
