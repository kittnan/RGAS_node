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
    let form = req.body.map(item=>{
      if(item._id){
        return {
          
        }
      }else{

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
