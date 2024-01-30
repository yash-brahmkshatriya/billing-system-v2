const auth = require('../../utils/encryption');
const User = require('../../modules/user/model');
const { CONTEXT_USER_KEY } = require('../../constants');

const populateUserIfExists = async (req, res, globalContextValue) => {
  let token =
    req.cookies?.Authorization ||
    req.headers?.Authorization ||
    req.headers?.authorization;

  if (!token) return;

  const userExist = await auth.findByToken(token);
  if (userExist) {
    const user = await User.findById(userExist._id).select({ password: 0 });
    if (user) {
      globalContextValue[CONTEXT_USER_KEY] = user;
    }
  }
};

const prepareContext = async (req, res) => {
  const globalContextValue = {};
  try {
    await populateUserIfExists(req, res, globalContextValue);
  } catch (e) {
    console.error('[prepareContext]' + e);
  }
  return globalContextValue;
};

module.exports = prepareContext;
