let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const MODELS = require("../models/estimate-shipment");
let axios = require("axios");

router.get("/", async (req, res, next) => {
  try {
    let { kydCD, year } = req.query
    let condition = [{
      $match: {}
    }]
    if (kydCD) {
      kydCD = JSON.parse(kydCD)
      condition.push({
        $match: {
          "KYD Cd": {
            $in: kydCD
          }
        }
      })
    }
    if (year) {
      condition.push({
        $match: {
          year: year
        }
      })
    }
    const usersQuery = await MODELS.aggregate(condition)
    res.json(usersQuery);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.get("/yearOption", async (req, res, next) => {
  try {
    let condition = [
      {
        $group:
        {
          _id: "$year"
        }
      },
      {
        $sort:{
          _id: -1
        }
      }
    ]
    const usersQuery = await MODELS.aggregate(condition)
    res.json(usersQuery);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/create", async (req, res, next) => {
  try {
    const data = await MODELS.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/import", async (req, res, next) => {
  try {
    const deleteData = await MODELS.deleteMany({})
    console.log("🚀 ~ deleteData:", deleteData)
    const data = await MODELS.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.put("/createOrUpdate", async (req, res, next) => {
  try {
    let form = req.body.map(item => {
      delete item._id
      return {
        updateOne: {
          filter: {
            Model: item['Model'],
            year: item['year']
          },
          update: {
            $set: item,
          },
          upsert: true
        }
      }
    })
    const data = await MODELS.bulkWrite(form)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
