let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const USERS = require("../models/users");
let axios = require("axios");

router.post("/login", async (req, res, next) => {
  try {
    const payload = req.body;
    const adAcc = await axios.post("http://10.200.90.152:4038/AzureLogin/getByCondition", {
      username: payload.username,
      password: payload.password,
    });
    console.log("🚀 ~ adAcc:", adAcc.data);
    if (adAcc?.data == "User not found") {
      const resDB = await USERS.aggregate([
        {
          $match: {
            employeeCode: payload.username,
            employeeCode: payload.password,
            active: true
          },
        },
      ]);
      if (resDB && resDB.length > 0) {
        res.json(resDB);
      } else {
        throw ''
      }
    } else {
      const resDB = await USERS.aggregate([
        {
          $match: {
            employee_code: adAcc.data.description,
            active: true
          },
        },
      ]);
      if (resDB && resDB.length > 0) {
        res.json(resDB);
      } else {
        throw ''
      }
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
})

router.post("/import", async (req, res, next) => {
  try {
    const deleteStat = await USERS.deleteMany({});
    console.log("🚀 ~ deleteStat:", deleteStat);
    const data = await USERS.insertMany(req.body);
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.post("/create", async (req, res, next) => {
  try {
    const data = await USERS.insertMany(req.body);
    res.json(data);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});

router.get("/", async (req, res, next) => {
  try {
    let con = [
      {
        $match: {}
      }
    ]
    let { _id, access, active = true, } = req.query
    if (active != 0) {
      con = [
        {
          $match: {
            active: active
          }
        }
      ]
    }

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
    if (_id) {
      con.push({
        $match: {
          _id: new ObjectId(_id)
        }
      })
    }
    const usersQuery = await USERS.aggregate(con);
    res.json(usersQuery);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});
router.get("/userNextApprove", async (req, res, next) => {
  try {
    let { access, active = true, formStatus } = req.query
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

    if (formStatus) {
      formStatus = JSON.parse(formStatus)
      if (formStatus == 'receive information') {
        con.push({
          $match: {
            access: 'engineer'
          }
        })
      }
    }
    const usersQuery = await USERS.aggregate(con);
    res.json(usersQuery);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});

router.post('/update', async (req, res) => {
  try {
    let data = req.body
    if (data && data.length > 0) {
      let updateItems = data.map(d => {
        return {
          updateMany: {
            filter: { _id: new ObjectId(d._id) },
            update: { $set: d }
          }
        }
      })
      let result = await USERS.bulkWrite(updateItems)
      res.json(result)
    } else {
      throw ''
    }
  } catch (error) {
    console.log("🚀 ~ error:", error)
    res.sendStatus(500)
  }
})

module.exports = router;
