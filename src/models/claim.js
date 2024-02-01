const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const model = new Schema(
  {
    "registerNo": String,
    "claimNo": String,
    "modelNo": String,
    "productNo": String,
    "customerNo": String,
    "modelCode": String,
    "analysisPIC": String,
    "customerName": String,
    "type": String,
    "descriptionJP": String,
    "saleCompany": String,
    "sideNo": String,
    "descriptionENG": String,
    "salePIC": String,
    "qty": Number,
    "functionAppearance": String,
    "returnStyle": String,
    "productLotNo": String,
    "AWBNo": String,
    "modelClassification": String,
    "productionMonth": String,
    "InvNo": String,
    "calendarYear": String,
    "commercialDistribution": String,
    "dateReceiveInv": Date,
    "claimRegisterDate": Date,
    "useAppearance": String,
    "transportationCost": String,
    "unit": String,
    "receiveInfoDate": Date,
    "occurredLocation": String,
    "costMonth": String,
    "dueDate": Date,
    "importance": String,
    "files": [
      {
        date: Date,
        delete_path:String,
        filename:String,
        index:Number,
        path:String
      }
    ],
    "status": String,
    "active": Boolean,
    "no":Number
  },
  { timestamps: true, versionKey: false, strict: true }
);

const UserModule = mongoose.model("claims", model);

module.exports = UserModule;
