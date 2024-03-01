let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const RESULT = require("../models/result");
let axios = require("axios");

router.get("/", async (req, res, next) => {
  try {
    let { registerNo, claimId, no } = req.query
    let con = [
      {
        $match: {}
      }
    ]
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
    if (claimId) {
      claimId = JSON.parse(claimId)
      con.push({
        $match: {
          claimId: {
            $in: claimId
          }
        }
      })
    }
    if (no) {
      no = JSON.parse(no)
      no = no.map(a => Number(a))
      con.push({
        $match: {
          no: {
            $in: no
          }
        }
      })
    }
    const usersQuery = await RESULT.aggregate(con);
    res.json(usersQuery);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/create", async (req, res, next) => {
  try {
    const data = await RESULT.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/import", async (req, res, next) => {
  try {
    const deleteData = await RESULT.deleteMany({})
    console.log("🚀 ~ deleteData:", deleteData)
    const data = await RESULT.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/createOrUpdate", async (req, res, next) => {
  try {
    let form = req.body.map(item => {
      if (item._id) {
        return {
          updateOne: {
            filter: { _id: new ObjectId(item._id) },
            update: { $set: item }
          }
        }
      } else {
        return { insertOne: { document: item } }
      }
    })
    const data = await RESULT.bulkWrite(form)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
