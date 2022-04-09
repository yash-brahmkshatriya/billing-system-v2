const express = require("express");
const appRouter = express.Router();

appRouter.use("/user", require("./modules/user"));
appRouter.use("/bills", require("./modules/bill"));

appRouter.use("*", (req, res) => res.send("Invalid API Endpoint"));
module.exports = appRouter;
