const mongoose = require("mongoose");
const config = require("../config");

module.exports = async (app) => {
  console.log("Boot script - Starting initdb");
  try {
    await mongoose.connect(config.mongo.url, {
      autoIndex: true,
      keepAlive: true,
    });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
