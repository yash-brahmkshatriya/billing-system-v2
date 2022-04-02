const BillModel = require("../modules/bill/model");
const responses = require("../utils/responses");
const messages = require("../utils/messages");

exports.isBillOwner = async (req, res, next) => {
  const { billId } = req.params.billId;
  const userId = req.user._id;
  let bill = await BillModel.findById(billId).populate("owner");
  if (bill.owner._id === userId) next();
  else
    return responses.sendForbidden(
      res,
      req.originalUrl,
      messages.auth.access_denied
    );
};
