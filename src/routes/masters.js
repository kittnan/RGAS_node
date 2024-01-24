let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const MASTERS = require("../models/masters");
let axios = require("axios");

router.get("/", async (req, res, next) => {
  try {
    let { groupName, itemName, itemValue, status } = req.query
    let condition = [{
      $match: {}
    }]
    if (status) {
      status = JSON.parse(status)
      condition.push({
        $match: {
          status: {
            $in: status
          }
        }
      })
    }
    if (itemValue) {
      itemValue = JSON.parse(itemValue)
      condition.push({
        $match: {
          itemValue: {
            $in: itemValue
          }
        }
      })
    }
    if (itemName) {
      itemName = JSON.parse(itemName)
      condition.push({
        $match: {
          itemName: {
            $in: itemName
          }
        }
      })
    }
    if (groupName) {
      groupName = JSON.parse(groupName)
      condition.push({
        $match: {
          groupName: {
            $in: groupName
          }
        }
      })
    }
    const usersQuery = await MASTERS.aggregate(condition).sort({ itemName: 1 })
    res.json(usersQuery);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/create", async (req, res, next) => {
  try {
    const data = await MASTERS.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/import", async (req, res, next) => {
  try {
    const deleteData = await MASTERS.deleteMany({})
    console.log("🚀 ~ deleteData:", deleteData)
    const data = await MASTERS.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/update", async (req, res, next) => {
  try {
    if (req.body) {
      let dataFiltered = req.body.filter(item => item._id)
      let form = dataFiltered.map(item => {
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
      })
      const data = await MASTERS.bulkWrite(form)
      res.json(data);
    } else {
      throw 'now found req body'
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
