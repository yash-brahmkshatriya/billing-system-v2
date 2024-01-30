module.exports = {
  mongo: {
    url: process.env.DB_URL,
  },
  saltRounds: 10,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: '6h',
  pagination: {
    size: 20,
  },
};
