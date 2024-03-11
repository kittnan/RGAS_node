let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const M1E = require("../models/m1e");
let axios = require("axios");

router.get("/", async (req, res, next) => {
  try {
    let { defect } = req.query
    let condition = [{
      $match: {}
    }]
    if (defect) {
      defect = JSON.parse(defect)
      condition.push({
        $match: {
          "Defect Phenomenon": {
            $in: defect
          }
        }
      })
    }
    const usersQuery = await M1E.aggregate(condition)
    res.json(usersQuery);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/create", async (req, res, next) => {
  try {
    const data = await M1E.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/import", async (req, res, next) => {
  try {
    const deleteData = await M1E.deleteMany({})
    console.log("🚀 ~ deleteData:", deleteData)
    const data = await M1E.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.put("/createOrUpdate", async (req, res, next) => {
  try {
    let form = req.body.map(item => {
      if (item._id) {
        return {

        }
      } else {

      }
    })
    const data = await M1E.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
