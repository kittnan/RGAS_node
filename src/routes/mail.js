let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const MAIL = require("../models/mail");
const MAIL_LOGS = require("../models/mail-log");
let axios = require("axios");
let nodemailer = require("nodemailer");


router.post("/send", async (req, res, next) => {
  try {
    let Mail = await MAIL.aggregate([{ $match: {} }])
    if (Mail && Mail.length > 0) {
      // console.log(req.body);
      let { to = [], cc = [], html = '' } = req.body
      Mail = Mail[0]
      let transporter = nodemailer.createTransport({
        host: Mail.host,
        port: Mail.port,
        secure: false,
        auth: {
          user: Mail.auth.user,
          pass: Mail.auth.pass,
        },
      });
      let info = await transporter.sendMail({
        from: Mail.from, // sender address
        to: to, // list of receivers
        cc: cc,
        subject: Mail.subject, // Subject line
        html: html
      });
      await MAIL_LOGS.insertMany({ info, subject: Mail.subject })
      res.json(info)
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});


module.exports = router;
