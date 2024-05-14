const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const model = new Schema(
  {
    ng: {
      qty: Number,
      value1: String,
      value2: String
    },
    notAccepted: {
      qty: Number,
      value1: String,
      value2: String
    },
    noAbnormality: {
      qty: Number,
      value1: String,
      value2: String
    },
    withinSpec: {
      qty: Number,
      value1: String,
      value2: String
    },
    notRecurred: {
      qty: Number,
      value1: String,
      value2: String
    },
    difference: {
      qty: Number,
      value1: String,
    },
    causeByCustomer: String,
    outWarranty: String,
    rootCause: String,

    rootCauseActions: [
      {
        value: String,
        date: Date,
        index: Number
      }
    ],
    leakCause: String,
    leakCauseActions: [
      {
        value: String,
        date: Date,
        index: Number
      }
    ],
    internal: String,
    internalActions: [
      {
        value: String,
        date: Date,
        index: Number
      }
    ],
    internalLeak: String,
    internalLeakActions: [
      {
        value: String,
        date: Date,
        index: Number
      }
    ],

  },
  { timestamps: true, versionKey: false, strict: false }
);

const UserModule = mongoose.model("reportInformation", model);

module.exports = UserModule;
