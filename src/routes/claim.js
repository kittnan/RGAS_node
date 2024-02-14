let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const CLAIM = require("../models/claim");
let axios = require("axios");
const moment = require("moment");


router.get("/", async (req, res, next) => {
  try {
    let { access, active = true, registerNo } = req.query
    console.log("🚀 ~ active:", active)
    let con = [
      {
        $match: {
          active: active
        }
      }
    ]
    if (access) {
      access = JSON.parse(access)
      con.push({
        $match: {
          access: {
            $in: access
          }
        }
      })
    }
    if (registerNo) {
      registerNo = JSON.parse(registerNo)
      con.push({
        $match: {
          registerNo: {
            $in: registerNo
          }
        }
      })
    }
    const data = await CLAIM.aggregate(con);
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});

router.post("/createOrUpdate", async (req, res, next) => {
  try {
    let body = req.body
    if (body && body._id) {
      const resData = await CLAIM.updateOne({ _id: new ObjectId(body._id) }, { $set: body })
      res.json(resData)

    } else {
      const registerNo = await createRegisterNo()
      body['registerNo'] = registerNo
      const resData = await CLAIM.insertMany(body)
      res.json(resData)
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
async function createRegisterNo() {
  const lastDoc = await CLAIM.aggregate([
    {
      $match: {
        createdAt: {
          $gte: moment().startOf('year').toDate(),
          $lte: moment().endOf('year').toDate()
        }
      }
    },
    {
      $sort: {
        registerNo: -1
      }
    },
    {
      $limit: 1
    }
  ])
  if (lastDoc && lastDoc.length > 0) {
    let lastNo = lastDoc[0].registerNo
    let runNo = (Number(lastNo.slice(-4)) + 1).toString().padStart(4, '0')
    return moment().format('YYYYMM') + runNo
  } else {
    let no = moment().format('YYYYMM0001')
    return no
  }
}

module.exports = router;
