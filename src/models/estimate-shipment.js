const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const model = new Schema(
  {

  },
  { timestamps: true, versionKey: false, strict: false }
);

const UserModule = mongoose.model("estimate-shipment", model);

module.exports = UserModule;
