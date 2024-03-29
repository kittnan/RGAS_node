const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const model = new Schema(
  {
    reviseDueDate: Date,
    reviseDate: Date,
    verifyDate: Date,
    applyDate: Date
  },
  { timestamps: true, versionKey: false, strict: false }
);

const UserModule = mongoose.model("document-verify", model);

module.exports = UserModule;
