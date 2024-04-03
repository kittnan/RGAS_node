let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const MAIL_MODEL = require("../models/mail");
const MAIL_LOGS_MODEL = require("../models/mail-log");
const CLAIM_MODEL = require("../models/claim");
const DEAR_ALL_MODEL = require("../models/dear-all-email");
const MAIL_TASKS_MODEL = require("../models/mail-tasks");
let axios = require("axios");
let nodemailer = require("nodemailer");
const cron = require('node-cron');

// cron.schedule(' * * * * *', async () => {
//   let tasks = await MAIL_TASKS_MODEL.aggregate([{ $match: {} }]).sort({ createdAt: 1 }).limit(10)
//   if (tasks && tasks.length > 0) {
//     let Mail = await MAIL_MODEL.aggregate([{ $match: {} }])
//     Mail = Mail.length > 0 ? Mail[0] : null
//     if (Mail) {
//       let transporter = nodemailer.createTransport({
//         host: Mail.host,
//         port: Mail.port,
//         secure: false,
//         auth: {
//           user: Mail.auth.user,
//           pass: Mail.auth.pass,
//         },
//       });
//       for (let index = 0; index < tasks.length; index++) {
//         const data = tasks[index];
//         let info = await transporter.sendMail({
//           from: Mail.from,
//           to: data.to,
//           cc: data.cc,
//           subject: data.subject,
//           html: data.html,
//         });
//         const delData = await MAIL_TASKS_MODEL.deleteOne({ _id: data._id })
//         await MAIL_LOGS_MODEL.insertMany({ info, subject: data.subject })
//         res.json(info)
//       }
//     }



//   }
// });

// router.post("/send", async (req, res, next) => {
//   try {
//     let data = req.body

//     let Mail = await MAIL_MODEL.aggregate([{ $match: {} }])
//     if (Mail && Mail.length > 0 && data) {
//       // console.log(req.body);
//       Mail = Mail[0]

//       let transporter = nodemailer.createTransport({
//         host: Mail.host,
//         port: Mail.port,
//         secure: false,
//         auth: {
//           user: Mail.auth.user,
//           pass: Mail.auth.pass,
//         },
//       });
//       let info = await transporter.sendMail({
//         from: Mail.from, // sender address
//         to: data.to, // list of receivers
//         cc: data.cc,
//         subject: data.subject, // Subject line
//         html: data.html,
//         attachments:[
//           {
//             path:'http://10.200.90.152:30000/RGAS//2024030001/1/preReport1/D_CD.xlsx'
//           }
//         ]
//       });
//       await MAIL_LOGS_MODEL.insertMany({ info, subject: data.subject })
//       res.json(info)
//     }
//   } catch (error) {
//     console.log("🚀 ~ error:", error);
//     res.sendStatus(500);
//   }
// });



module.exports = router;
