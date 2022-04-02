const { Router } = require("express");
const BillController = require("./controller");
const authenticate = require("../../middlewares/authenticate");
const { isBillOwner } = require("../../middlewares/hasAccess");

const billRouter = Router();

billRouter.get("/", authenticate, (req, res) => {
  let data = {
    query: req.query,
    user: req.user,
  };
  BillController.select(data, res);
});

billRouter.get("/next-bill", authenticate, (req, res) => {
  let data = {
    user: req.user,
  };
  BillController.getLatestBillDetails(data, res);
});

billRouter.get("/:billId", authenticate, isBillOwner, (req, res) => {
  let data = {
    query: req.query,
    user: req.user,
    params: req.params,
  };
  BillController.selectOne(data, res);
});

billRouter.post("/", authenticate, (req, res) => {
  let data = {
    body: req.body,
    query: req.query,
    user: req.user,
  };
  BillController.create(data, res);
});

billRouter.put("/:billId", authenticate, isBillOwner, (req, res) => {
  let data = {
    body: req.body,
    user: req.user,
    params: req.params,
  };
  BillController.edit(data, res);
});

billRouter.delete("/:billId", authenticate, isBillOwner, (req, res) => {
  let data = {
    params: req.params,
    user: req.user,
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
    };
    res.send("Coming Soon!");
  }
);

billRouter.get("/:billId/generateDC", authenticate, isBillOwner, (req, res) => {
  let data = {
    query: req.query,
    user: req.user,
  };
  res.send("Coming Soon!");
});
