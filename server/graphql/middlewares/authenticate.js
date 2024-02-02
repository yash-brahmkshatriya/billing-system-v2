const messages = require('../../utils/messages');
const response = require('../../utils/responses');
const { CONTEXT_USER_KEY } = require('../../constants');
const { getContextValue, getQueryArgs } = require('./middlewareChain');

const isAuthenticated = (resolverArgs, next) => {
  if (getContextValue(resolverArgs)[CONTEXT_USER_KEY]) next();
  else response.throwGraphQLError(messages.common.unauthorized_login);
};

const isSelf = (resolverArgs, next) => {
  const contextValue = getContextValue(resolverArgs);
  const queryArgs = getQueryArgs(resolverArgs);

  if (contextValue[CONTEXT_USER_KEY]._id.toString() === queryArgs._id) next();
  else response.throwGraphQLError(messages.common.unauthorized_module);
};

module.exports = { isAuthenticated, isSelf };
