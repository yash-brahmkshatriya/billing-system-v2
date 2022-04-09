const BillModel = require("../modules/bill/model");
const responses = require("../utils/responses");
const messages = require("../utils/messages");

exports.isBillOwner = async (req, res, next) => {
  const { billId } = req.params;
  const userId = req.user._id;
  let bill = await BillModel.findById(billId).populate("owner");
  if (!bill) return responses.sendNotFound(res, req.originalUrl);
  else if (bill.owner._id.equals(userId)) next();
  else
    return responses.sendForbidden(
      res,
      req.originalUrl,
      messages.auth.access_denied
    );
};
