const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const handlebars = require('./hbs');
const Bills = require('./model');
const responses = require('../../utils/responses');
const messages = require('../../utils/messages');
const common = require('../../utils/common');
const { pagination } = require('../../config');

const BILL_TEMPLATE_FILE = path.join(__dirname, 'template', 'billIndex.hbs');
const DC_TEMPLATE_FILE = path.join(__dirname, 'template', 'dcIndex.hbs');
class BillController {
  getBillPDFTemplate() {
    const templateHtml = fs.readFileSync(BILL_TEMPLATE_FILE, 'utf8');
    return handlebars.compile(templateHtml);
  }
  getDCPDFTemplate() {
    const templateHtml = fs.readFileSync(DC_TEMPLATE_FILE, 'utf8');
    return handlebars.compile(templateHtml);
  }
  getBillPDFItemCellStyleValues() {
    return {
      charLength: 12,
      charHeight: 12,
      parentBoxHeight: 350,
    };
  }
  getDCPDFItemCellStyleValues() {
    return {
      charLength: 12,
      charHeight: 12,
      parentBoxHeight: 480,
    };
  }
  async create(data, res) {
    try {
      const requiredFields = ['partyDetails', 'items'];
      if (!common.checkKeys(data.body, requiredFields)) {
        return responses.sendBadRequest(res, data.url);
      }
      data.body.items = data.body.items.map((item) =>
        common.removeFromObject(item, ['_id'])
      );
      data.body.owner = data.user._id;

      const NOW = new Date();
      const dateOfBill = new Date(data.body?.bill?.date) || NOW;
      const dateOfDC = new Date(data.body?.dc?.date) || NOW;

      let nextBillNumber = await this.getNextBillNumbers(
        data.user,
        dateOfBill.toISOString()
      );
      data.body.bill = {
        number: nextBillNumber.billNumber,
        date: dateOfBill,
      };
      data.body.dc = {
        number: nextBillNumber.dcNumber,
        date: dateOfDC,
      };
      let bill = await Bills.create(data.body);

      return responses.sendSuccess(res, bill, messages.bills.bill_created);
    } catch (e) {
      console.error(e);
      return responses.sendServerError(res, data.url);
    }
  }

  async getLatestBillDetails(data, res) {
    try {
      let billDate = data.query.date ?? new Date().toISOString();
      let bill = await this.getNextBillNumbers(
        data.user,
        billDate,
        data.query.billId ?? null
      );
      return responses.sendSuccess(res, bill);
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
      let sortBy = data.query.sortBy || '-_id';
      delete data.query.page;
      delete data.query.limit;
      delete data.query.sortBy;

      if (data.query.search) {
        // const searchRegex = new RegExp(`^.*${data.query.search}.*$`, 'im');
        const searchRegex = new RegExp(data.query.search, 'im');
        data.query['$or'] = [
          { partyDetails: searchRegex },
          { 'po.number': searchRegex },
          { 'items.description': searchRegex },
        ];
        delete data.query.search;
      }

      data.query.isCancelled = { $ne: true };
      data.query.owner = data.user._id;

      if (data.query.all) {
        delete data.query.all;
        records = await Bills.find(data.query).sort(sortBy);

        return responses.sendSuccess(res, records, messages.constant.retrive);
      }
      const financialDates = this.getCurrentFinancialYearDates();
      let startDate;
      let endDate;

      if (data.query.startDate && data.query.endDate) {
        startDate = data.query.startDate;
        endDate = data.query.endDate;
      } else {
        startDate = financialDates.start;
        endDate = financialDates.end;
      }

      data.query['bill.date'] = {
        $gte: startDate,
        $lte: endDate,
      };

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
      console.error(e);
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
      delete body.owner;
      const requiredFields = ['partyDetails', 'items'];
      if (!common.checkKeys(body, requiredFields)) {
        return responses.sendBadRequest(res, data.url);
      }
      let bill = await Bills.findById(data.params.billId);
      bill.partyDetails = data.body.partyDetails;
      bill.items = data.body.items.map((item) =>
        common.removeFromObject(item, ['_id'])
      );
      const dateOfBill = new Date(data.body?.bill?.date) || NOW;
      const dateOfDC = new Date(data.body?.dc?.date) || NOW;

      let nextBillNumber = await this.getNextBillNumbers(
        data.user,
        dateOfBill.toISOString(),
        data.params.billId
      );

      bill.bill = { number: nextBillNumber.billNumber, date: dateOfBill };
      bill.dc = { number: nextBillNumber.dcNumber, date: dateOfDC };
      bill.po = data.body.po;

      bill = await bill.save();
      if (bill) {
        return responses.sendSuccess(res, bill, messages.bills.bill_updated);
      } else
        return responses.sendNotFound(
          res,
          data.url,
          messages.bills.bills_not_found
        );
    } catch (e) {
      console.error(e);
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

  getCurrentFinancialYearDates(dateString = null) {
    let date = dateString ? new Date(dateString) : new Date();

    let financialBeginYear =
      date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();
    let financialYearStartDate = new Date(
      `04/01/${financialBeginYear} 00:00:00`
    );
    let financialYearEndDate = new Date(
      `03/31/${financialBeginYear + 1} 23:59:59`
    );

    return { start: financialYearStartDate, end: financialYearEndDate };
  }

  async getNextBillNumbers(user, billDate, billId = null) {
    try {
      // bill Date in form of iso string or mm-dd-yyyy
      if (!billDate) throw new Error('Bill Date is required');
      const financialDates = this.getCurrentFinancialYearDates(billDate);
      let bill;
      if (billId) {
        bill = await Bills.findById(billId);
      }
      if (
        bill &&
        financialDates.start <= new Date(bill.bill.date) &&
        new Date(bill.bill.date) <= financialDates.end
      ) {
        return {
          billNumber: bill.bill.number,
          dcNumber: bill.dc.number,
        };
      }

      bill = await Bills.findOne({
        owner: user._id,
        'bill.date': {
          $gte: financialDates.start,
          $lte: financialDates.end,
        },
      })
        .sort({ 'bill.number': -1 })
        .limit(1)
        .select('bill.number dc.number');
      if (bill)
        return {
          billNumber: bill.bill.number + 1,
          dcNumber: bill.dc.number + 1,
        };
      else
        return {
          billNumber: 1,
          dcNumber: 1,
        };
    } catch (e) {
      throw e;
    }
  }

  async createBufferFromHTML(htmlString) {
    const uriHTML = encodeURIComponent(htmlString);

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(`data:text/html;charset=UTF-8,${uriHTML}`, {
      waitUntil: 'networkidle0',
    });

    const buffer = await page.pdf({
      format: 'a4',
      margin: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 0,
      },
      displayHeaderFooter: false,
    });

    await browser.close();

    return buffer;
  }
  async generateBillPDF(data, res) {
    try {
      let bill = await Bills.findById(data.params.billId)
        .populate('owner')
        .lean(true);

      const billPDFItemCellStyleValues = this.getBillPDFItemCellStyleValues();
      const expectedHeightOfItems = bill.items.reduce(
        (acc, currItem) =>
          acc +
          common.expectedHeightInPDF(
            currItem.description,
            billPDFItemCellStyleValues.charLength,
            billPDFItemCellStyleValues.charHeight,
            billPDFItemCellStyleValues.parentBoxHeight
          ),
        0
      );

      // in px
      const totalHeightReqd = 500;

      bill.emptyRowSpacingHeight = totalHeightReqd - expectedHeightOfItems;

      const finalHTML = this.getBillPDFTemplate()(bill);
      fs.writeFileSync('./out/bill.html', finalHTML);
      // return res.sendFile(path.join(process.cwd(), 'out', 'bill.html'));

      const billPDFBuffer = await this.createBufferFromHTML(finalHTML);

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        // 'Content-disposition': 'attachment; filename=' + data.params.billId,
        'Content-Length': billPDFBuffer.length,
      });
      return res.end(billPDFBuffer);
    } catch (err) {
      console.error(err);
      return responses.sendServerError(res, data.url);
    }
  }
  async generateDCPDF(data, res) {
    try {
      let bill = await Bills.findById(data.params.billId)
        .populate('owner')
        .lean(true);

      const dcPDFItemCellStyleValues = this.getDCPDFItemCellStyleValues();
      const expectedHeightOfItems = bill.items.reduce(
        (acc, currItem) =>
          acc +
          common.expectedHeightInPDF(
            currItem.description,
            dcPDFItemCellStyleValues.charLength,
            dcPDFItemCellStyleValues.charHeight,
            dcPDFItemCellStyleValues.parentBoxHeight
          ),
        0
      );

      // in px
      const totalHeightReqd = 500;

      bill.emptyRowSpacingHeight = totalHeightReqd - expectedHeightOfItems;

      const finalHTML = this.getDCPDFTemplate()(bill);
      fs.writeFileSync('./out/dc.html', finalHTML);
      // return res.sendFile(path.join(process.cwd(), 'out', 'bill.html'));

      const dcPDFBuffer = await this.createBufferFromHTML(finalHTML);

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        // 'Content-disposition': 'attachment; filename=' + data.params.billId,
        'Content-Length': dcPDFBuffer.length,
      });
      return res.end(dcPDFBuffer);
    } catch (err) {
      console.error(err);
      return responses.sendServerError(res, data.url);
    }
  }
}

module.exports = new BillController();
