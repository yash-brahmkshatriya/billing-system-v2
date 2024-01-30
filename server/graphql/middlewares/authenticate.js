const messages = require('../../utils/messages');
const response = require('../../utils/responses');
const { CONTEXT_USER_KEY } = require('../../constants');

const isAuthenticated = (contextValue, next) => {
  if (contextValue[CONTEXT_USER_KEY]) next();
  else response.throwGraphQLError(messages.common.unauthorized_login);
};

module.exports = { isAuthenticated };
