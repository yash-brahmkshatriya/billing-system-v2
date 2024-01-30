const { GraphQLError } = require('graphql');

const throwGraphQLError = (errorMessage, statusCode) => {
  throw new GraphQLError(errorMessage, {
    status: statusCode ?? null,
  });
};

const sendSuccess = (res, data, message = 'Success', meta = {}) => {
  return res.status(200).json({
    message,
    data,
    meta,
  });
};

const sendBadRequest = (res, url = null, message = 'Bad Request') => {
  return res.status(400).json({ message, url });
};

const sendUnauthorized = (res, url = null, message = 'Unauthorized') => {
  return res.status(401).json({ message, url });
};

const sendForbidden = (res, url = null, message = 'Forbidden') => {
  return res.status(403).json({ message, url });
};

const sendNotFound = (res, url = null, message = 'Not Found') => {
  return res.status(404).json({ message, url });
};

const sendServerError = (res, url = null, message = 'System error') => {
  return res.status(500).json({ message, url });
};

module.exports = {
  sendBadRequest,
  sendForbidden,
  sendNotFound,
  sendServerError,
  sendSuccess,
  sendUnauthorized,
  throwGraphQLError,
};
