const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const model = new Schema(
  {
    groupName: String,
    itemName: String,
    itemValue: String,
    status: String
  },
  { timestamps: true, versionKey: false, strict: true }
);

const UserModule = mongoose.model("masters", model);

module.exports = UserModule;
