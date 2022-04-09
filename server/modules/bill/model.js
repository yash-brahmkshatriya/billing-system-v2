const mongoose = require("mongoose");

const BillModel = mongoose.Schema(
  {
    bill: {
      number: { type: Number, required: true },
      date: { type: Date, required: true },
    },
    dc: {
      number: { type: Number, required: true },
      date: { type: Date, required: true },
    },
    po: {
      number: { type: Number },
      date: { type: Date },
    },
    items: [
      {
        description: { type: String, required: true },
        rate: { type: Number, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true, default: "Nos." },
        qtyPerUnit: { type: Number, required: true, default: 1 },
        amount: { type: Number },
      },
    ],
    partyDetails: {
      type: String,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    cancelledReason: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    grandTotal: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
BillModel.pre("save", function (next) {
  this.items.forEach(
    (item) => (item.amount = (item.rate * item.quantity) / item.qtyPerUnit)
  );
  this.grandTotal = this.items.reduce(
    (sumTillNow, item) => sumTillNow + item.amount,
    0
  );
  next();
});

module.exports = mongoose.model("bills", BillModel);
