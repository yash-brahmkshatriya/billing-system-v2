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
    cancel: {
      isCancelled: {
        type: Boolean,
        default: false,
      },
      reason: {
        type: String,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

BillModel.virtual("grandTotal").get(function () {
  return this.items.reduce((sumTillNow, item) => sumTillNow + item.amount, 0);
});

module.exports = mongoose.model("bills", BillModel);
