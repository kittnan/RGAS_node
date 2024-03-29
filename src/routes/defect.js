let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const DEFECT = require("../models/defect");
let axios = require("axios");

router.get("/", async (req, res, next) => {
  try {
    const usersQuery = await DEFECT.aggregate([
      {
        $match: {

        },
      },
    ]);
    res.json(usersQuery);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.get("/table", async (req, res, next) => {
  try {
    let { page, limit } = req.query
    let condition = [
      {
        $match: {}
      }
    ]
    if (page && limit) {
      condition.push({
        $skip: page * limit,
      });
    }
    if (limit && limit != 0) {
      condition.push({
        $limit: Number(limit),
      });
    }

    const query = await DEFECT.aggregate(condition);
    const count = await DEFECT.aggregate([{ $count: "rows" }]);
    res.json({ data: query, count: count });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/create", async (req, res, next) => {
  try {
    const data = await DEFECT.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/import", async (req, res, next) => {
  try {
    const deleteData = await DEFECT.deleteMany({})
    console.log("🚀 ~ deleteData:", deleteData)
    const data = await DEFECT.insertMany(req.body)
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
    const data = await DEFECT.insertMany(req.body)
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
