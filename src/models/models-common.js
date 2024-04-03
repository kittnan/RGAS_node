const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const model = new Schema(
  {
    "Model(MDL)":String,
    "Model(PNL)":String,
    "Model(SMT)":String,
  },
  { timestamps: true, versionKey: false, strict: false }
);

const UserModule = mongoose.model("models-commons", model);

module.exports = UserModule;
