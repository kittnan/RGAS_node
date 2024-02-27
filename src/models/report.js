const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const model = new Schema(
  {
    dueDate: Date,
    dateSubmitToCustomer:Date
  },
  { timestamps: true, versionKey: false, strict: false }
);

const UserModule = mongoose.model("report", model);

module.exports = UserModule;
