let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const CLAIM = require("../models/claim");
const RESULT = require("../models/result");
let axios = require("axios");
const moment = require("moment");


router.get("/", async (req, res, next) => {
  try {
    let { access, active = true, registerNo, no } = req.query
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
    if (no) {
      no = JSON.parse(no).map(item=>Number(item))
      con.push({
        $match: {
          no: {
            $in: no
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
    let payload = req.body
    if (payload && payload._id) {
      const resData = await CLAIM.updateOne({ _id: new ObjectId(payload._id) }, { $set: payload })
      res.json(resData)
    } else {
      const registerNo = await createRegisterNo()
      payload['registerNo'] = registerNo
      payload.no = 1
      const resData = await CLAIM.insertMany(payload)
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

// todo body new claim copy send-> require delete _id
router.post("/createSub", async (req, res, next) => {
  try {
    const payload = req.body
    delete payload._id
    delete payload.createdAt
    delete payload.updatedAt
    const createResult = await CLAIM.insertMany(payload)

    let result = await CLAIM.aggregate([
      {
        $match: {
          registerNo: payload.registerNo
        }
      },
      {
        $sort: {
          createdAt: 1
        }
      }
    ])
    result = result.map((item, index) => {
      item.no = index + 1
      return item
    }).filter(item => item)
    if (result.length === 0) throw 'error'
    const formUpdate = result.map(item => {
      if (item._id) {
        return {
          updateOne: {
            filter: {
              _id: new ObjectId(item._id)
            },
            update: {
              $set: item
            }
          }
        }
      } else {
        delete item._id
        delete item.createdAt
        delete item.updatedAt
        return { insertOne: { document: item } }
      }
    })
    const data = await CLAIM.bulkWrite(formUpdate)
    const claimResult = await CLAIM.aggregate([
      {
        $match: {
          registerNo: payload.registerNo
        }
      }
    ])
    res.json(claimResult)
  } catch (error) {
    console.log("🚀 ~ error:", error)
    res.sendStatus(500)
  }
})

// todo delete
router.delete('', async (req, res) => {
  try {
    let { _id } = req.query
    let result = await CLAIM.deleteOne({ _id: new ObjectId(_id) })
    let result2 = await RESULT.deleteOne({ claim_id: _id })
    res.json(result)
  } catch (error) {
    console.log("🚀 ~ error:", error)
    res.sendStatus(500)
  }
})

module.exports = router;
