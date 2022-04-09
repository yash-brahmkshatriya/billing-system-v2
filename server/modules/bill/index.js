const { Router } = require("express");
const BillController = require("./controller");
const authenticate = require("../../middlewares/authenticate");
const { isBillOwner } = require("../../middlewares/hasAccess");

const billRouter = Router();

billRouter.get("/", authenticate, (req, res) => {
  let data = {
    query: req.query,
    user: req.user,
    url: req.originalUrl,
  };
  BillController.select(data, res);
});

billRouter.post("/", authenticate, (req, res) => {
  let data = {
    body: req.body,
    query: req.query,
    user: req.user,
    url: req.originalUrl,
  };
  BillController.create(data, res);
});

billRouter.get("/next-bill", authenticate, (req, res) => {
  let data = {
    user: req.user,
    query: req.query,
    url: req.originalUrl,
  };
  BillController.getLatestBillDetails(data, res);
});

billRouter.get("/:billId", authenticate, isBillOwner, (req, res) => {
  let data = {
    query: req.query,
    user: req.user,
    params: req.params,
    url: req.originalUrl,
  };
  BillController.selectOne(data, res);
});

billRouter.put("/:billId", authenticate, isBillOwner, (req, res) => {
  let data = {
    body: req.body,
    user: req.user,
    params: req.params,
    url: req.originalUrl,
  };
  BillController.edit(data, res);
});

billRouter.delete("/:billId", authenticate, isBillOwner, (req, res) => {
  let data = {
    params: req.params,
    user: req.user,
    url: req.originalUrl,
  };
  BillController.delete(data, res);
});

billRouter.get(
  "/:billId/generateBill",
  authenticate,
  isBillOwner,
  (req, res) => {
    let data = {
      query: req.query,
      user: req.user,
      url: req.originalUrl,
    };
    res.send("Coming Soon!");
  }
);

billRouter.get("/:billId/generateDC", authenticate, isBillOwner, (req, res) => {
  let data = {
    query: req.query,
    user: req.user,
    url: req.originalUrl,
  };
  res.send("Coming Soon!");
});

module.exports = billRouter;
