const auth = require("../utils/encryption");
const User = require("../modules/user/model");
const messages = require("../utils/messages")["common"];
const response = require("../utils/responses");

const authenticate = async (req, res, next) => {
  let token =
    req.cookies.Authorization ||
    req.headers.Authorization ||
    req.headers.authorization;

  if (token) {
    try {
      const userExist = await auth.findByToken(token);
      if (userExist) {
        const user = await User.findById(userExist._id).select({ password: 0 });
        if (user) {
          req.user = user;
          return next();
        }
      }
    } catch (err) {
      return response.sendServerError(res, err);
    }
  }
  return response.sendUnauthorized(res, messages.unauthorized_login);
};

module.exports = authenticate;
