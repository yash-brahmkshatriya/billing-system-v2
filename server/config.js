module.exports = {
  mongo: {
    url: process.env.DB_URL,
  },
  saltRounds: 20,
  jwtSecret: process.env.JWT_SECRET,
  pagination: {
    size: 20,
  },
};
