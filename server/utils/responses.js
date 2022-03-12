const sendSuccess = (res, message = "Success", data, meta = {}) => {
  return res.status(200).json({
    message,
    data,
    meta,
  });
};

const sendBadRequest = (res, message = "Bad Request", url = null) => {
  return res.status(400).json({ message, url });
};

const sendUnauthorized = (res, message = "Unauthorized", url = null) => {
  return res.status(401).json({ message, url });
};

const sendForbidden = (res, message = "Forbidden", url = null) => {
  return res.status(403).json({ message, url });
};

const sendNotFound = (res, message = "Not Found", url = null) => {
  return res.status(404).json({ message, url });
};

const sendServerError = (res, message = "System error", url = null) => {
  return res.status(500).json({ message, url });
};
