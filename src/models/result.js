const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const model = new Schema(
  {
    partReceivingDate: Date,
    appearance: {
      analysisDate: Date
    },
    function: {
      analysisDate: Date
    },
    electrical: {
      analysisDate: Date
    },
    disassembly: {
      analysisDate: Date
    },
    microscope: {
      analysisDate: Date
    },
    supplier: {
      issueDate: Date
    },


  },
  { timestamps: true, versionKey: false, strict: false }
);

const UserModule = mongoose.model("result", model);

module.exports = UserModule;
