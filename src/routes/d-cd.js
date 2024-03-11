let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const D_CD = require("../models/d-cd");
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
    const usersQuery = await D_CD.aggregate(condition)
    res.json(usersQuery);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/create", async (req, res, next) => {
  try {
    const data = await D_CD.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/import", async (req, res, next) => {
  try {
    const deleteData = await D_CD.deleteMany({})
    console.log("🚀 ~ deleteData:", deleteData)
    const data = await D_CD.insertMany(req.body)
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
    const data = await D_CD.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
