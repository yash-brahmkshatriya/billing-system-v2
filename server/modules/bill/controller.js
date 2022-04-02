const Bills = require("./model");
const responses = require("../../utils/responses");
const messages = require("../../utils/messages");
const common = require("../../utils/common");
const { pagination } = require("../../config");

class BillController {
  async create(data, res) {
    try {
      const requiredFields = ["partyDetails", "items"];
      if (!common.checkKeys(data.body, requiredFields)) {
        return responses.sendBadRequest(res, data.url);
      }
      data.body.owner = data.user._id;
      let oldLatestBill = this.getLatestBill(data.user);
      const NOW = new Date();
      if (oldLatestBill) {
        data.body.bill = {
          number: oldLatestBill.bill.number + 1,
          date: NOW,
        };
        data.body.dc = {
          number: oldLatestBill.dc.number + 1,
          date: NOW,
        };
      } else {
        data.body.bill = {
          number: 1,
          date: NOW,
        };
        data.body.dc = {
          number: 1,
          date: NOW,
        };
      }
      let bill = await Bills.create(data.body);

      return responses.sendSuccess(res, bill, messages.bills.bill_created);
    } catch (e) {
      return responses.sendServerError(res, data.url);
    }
  }

  async getLatestBillDetails(data, res) {
    try {
      let bill = await this.getLatestBill(data.user);
      if (bill) return responses.sendSuccess(res, bill);
      return responses.sendNotFound(
        res,
        data.url,
        messages.bills.bills_not_found
      );
    } catch (e) {
      return responses.sendServerError(res, data.url);
    }
  }

  async select(data, res) {
    let records = [],
      meta = {};
    try {
      let page = parseInt(data.query.page) || 1;
      let limit = parseInt(data.query.limit) || pagination.size;
      let skip = (page - 1) * limit;
      let sortBy = data.query.sortBy || "_id";
      delete data.query.page;
      delete data.query.limit;
      delete data.query.sortBy;

      data.query.isCancelled = { $ne: true };
      data.query.owner = data.user._id;

      if (data.query.all) {
        delete data.query.all;
        records = await Bills.find(data.query).sort(sortBy);

        return responses.sendSuccess(res, records, messages.constant.retrive);
      }
      records = await Bills.find(data.query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit);

      meta = {
        currentPage: page,
        recordPerPage: limit,
        totalRecords: await Bills.find(data.query).count(),
      };
      meta.totalPages = Math.ceil(meta.totalRecords / meta.recordPerPage);
      return responses.sendSuccess(
        res,
        records,
        messages.constant.retrive,
        meta
      );
    } catch (e) {
      return responses.sendServerError(res, data.url);
    }
  }

  async selectOne(data, res) {
    try {
      data.params._id = data.params.billId;
      let bill = await Bills.findOne(data.params);
      return responses.sendSuccess(res, bill, messages.constant.retrive);
    } catch (e) {
      return responses.sendServerError(res, data.url);
    }
  }

  async edit(data, res) {
    try {
      let body = data.body;
      delete body.bill;
      delete body.dc;
      delete body.owner;
      const requiredFields = ["partyDetails", "items"];
      if (!common.checkKeys(body, requiredFields)) {
        return responses.sendBadRequest(res, data.url);
      }
      let bill = await Bills.findByIdAndUpdate(
        data.params.billId,
        {
          $set: body,
        },
        { new: true }
      );
      if (bill) {
        return responses.sendSuccess(res, bill, messages.bills.bill_updated);
      } else
        return responses.sendNotFound(
          res,
          data.url,
          messages.bills.bills_not_found
        );
    } catch (e) {
      return responses.sendServerError(res, data.url);
    }
  }

  async delete(data, res) {
    try {
      let reason = data.body.cancelledReason;
      let bill = await Bills.findByIdAndUpdate(
        data.params.billId,
        {
          $set: { isCancelled: true, cancelledReason: reason },
        },
        { new: true }
      );
      if (bill) {
        return responses.sendSuccess(res, {}, messages.bills.bill_cancelled);
      } else
        return responses.sendNotFound(
          res,
          data.url,
          messages.bills.bills_not_found
        );
    } catch (e) {
      return responses.sendServerError(res, data.url);
    }
  }

  async getLatestBill(user) {
    try {
      let bill = await Bills.find({ owner: user._id })
        .sort({ "bill.number": -1 })
        .limit(1)
        .select("bill dc");
      if (bill) return bill;
      else return null;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new BillController();
