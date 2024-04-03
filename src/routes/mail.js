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


router.post("/send", async (req, res, next) => {
  try {
    let data = req.body

    let Mail = await MAIL_MODEL.aggregate([{ $match: {} }])
    if (Mail && Mail.length > 0 && data) {
      // console.log(req.body);
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
        from: Mail.from,
        to: data.to,
        cc: data.cc,
        subject: data.subject,
        html: data.html,
      });

      const insertData = {
        from: Mail.from,
        to: data.to,
        cc: data.cc,
        subject: data.subject,
        html: data.html,
      }
      await MAIL_LOGS_MODEL.insertMany({ info, subject: data.subject })
      res.json(info)
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
// router.post("/send", async (req, res, next) => {
//   try {
//     let data = req.body

//     let Mail = await MAIL_MODEL.aggregate([{ $match: {} }])
//     if (Mail && Mail.length > 0 && data) {
//       // console.log(req.body);
//       Mail = Mail[0]

//       const insertData = {
//         from: Mail.from,
//         to: data.to,
//         cc: data.cc,
//         subject: data.subject,
//         html: data.html,
//       }

//       const result = await MAIL_TASKS_MODEL.insertMany([insertData])
//       res.json(result)
//     }
//   } catch (error) {
//     console.log("🚀 ~ error:", error);
//     res.sendStatus(500);
//   }
// });

router.get('/dear-all-email', async (req, res, next) => {
  try {
    const data = await DEAR_ALL_MODEL.aggregate([{ $match: {} }])
    res.json(data)
  } catch (error) {
    console.log("🚀 ~ error:", error)
    res.sendStatus(500)
  }
})
// router.post("/send", async (req, res, next) => {
//   try {
//     let data = req.body.data
//     console.log("🚀 ~ data:", data)
//     let claimData = await CLAIM_MODEL.aggregate([
//       {
//         $lookup:
//         {
//           from: "results",
//           let: {
//             var1: "$registerNo",
//             var2: "$no"
//           },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     {
//                       $eq: ["$registerNo", "$$var1"]
//                     },
//                     {
//                       $eq: ["$no", "$$var2"]
//                     }
//                   ]
//                 }
//               }
//             }
//           ],
//           as: "result"
//         }
//       },
//       {
//         $addFields:
//         {
//           result: {
//             $arrayElemAt: ["$result", 0]
//           }
//         }
//       },
//       {
//         $lookup:
//         {
//           from: "reportinformations",
//           let: {
//             var1: "$registerNo",
//             var2: "$no"
//           },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     {
//                       $eq: ["$registerNo", "$$var1"]
//                     },
//                     {
//                       $eq: ["$no", "$$var2"]
//                     }
//                   ]
//                 }
//               }
//             }
//           ],
//           as: "information"
//         }
//       },
//       {
//         $addFields:
//         {
//           information: {
//             $arrayElemAt: ["$information", 0]
//           }
//         }
//       }
//     ])
//     console.log("🚀 ~ claimData:", claimData)
//     let Mail = await MAIL_MODEL.aggregate([{ $match: {} }])
//     if (Mail && Mail.length > 0 && claimData && claimData.length > 0) { 
//       // console.log(req.body);
//       let { to = [], cc = [], html = '' } = req.body
//       Mail = Mail[0]
//       claimData = claimData[0]

//       let type = claimData.type
//       html = html.replaceAll('$type', type)
//       let occurredLocation = claimData.occurredLocation
//       html = html.replaceAll('$occurredLocation', occurredLocation)
//       let qty = claimData.qty
//       html = html.replaceAll('$qty', qty)
//       let modelCode = claimData.modelNo
//       html = html.replaceAll('$modelCode', modelCode)
//       let productLotNo = claimData.productNo
//       html = html.replaceAll('$productLotNo', productLotNo)
//       let serial = ''
//       html = html.replaceAll('$serial', serial)
//       let failure = ''
//       html = html.replaceAll('$failure', failure)
//       let occur = ''
//       html = html.replaceAll('$occur', occur)
//       let text = ''
//       html = html.replaceAll('$text', text)
//       let link = ''
//       html = html.replaceAll('$link', link)

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
//         to: to, // list of receivers
//         cc: cc,
//         subject: Mail.subject, // Subject line
//         html: html
//       });
//       await MAIL_LOGS_MODEL.insertMany({ info, subject: Mail.subject })
//       res.json(info)
//     }
//   } catch (error) {
//     console.log("🚀 ~ error:", error);
//     res.sendStatus(500);
//   }
// });


module.exports = router;
