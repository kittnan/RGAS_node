const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const model = new Schema(
  {
    Model: {
      type: String,
      default: ''
    }
  },
  { timestamps: true, versionKey: false, strict: false }
);

const UserModule = mongoose.model("models", model);

module.exports = UserModule;
