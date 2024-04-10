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
      no = JSON.parse(no).map(item => Number(item))
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
router.get("/getRgas1", async (req, res, next) => {
  try {
    let { access, status, registerNo, no, claimNo, PIC, modelNo, modelName, claimMonth, customerInformation, customerName, ktcAnalysisResult, judgment } = req.query
    let con = [
      {
        $match: {
          // active: active
        }
      }
    ]
    let con2 = [
      {
        $match: {
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
      no = JSON.parse(no).map(item => Number(item))
      con.push({
        $match: {
          no: {
            $in: no
          }
        }
      })
    }
    if (claimNo) {
      con.push({
        $match: {
          claimNo: {
            $regex: new RegExp(claimNo, "i")
          }
        }
      })
    }
    if (PIC) {
      con.push({
        $match: {
          "analysisPIC.name": {
            $regex: new RegExp(PIC, "i")
          }
        }
      })
    }
    if (modelNo) {
      con.push({
        $match: {
          modelNo: {
            $regex: new RegExp(modelNo, "i")
          }
        }
      })
    }
    if (modelName) {
      con.push({
        $match: {
          modelCode: {
            $regex: new RegExp(modelName, "i")
          }
        }
      })
    }
    if (claimMonth) {
      let dateStr = claimMonth.trim()
      dateStr = dateStr ? dateStr.split('-') : null
      if (dateStr && dateStr.length == 2) {
        con.push({
          $match: {
            claimRegisterDate: {
              $gte: moment(`01-${dateStr[0]}-${dateStr[1]}`, 'DD-MM-YYYY').startOf('month').toDate(),
              $lte: moment(`01-${dateStr[0]}-${dateStr[1]}`, 'DD-MM-YYYY').endOf('month').toDate()
            }
          }
        })
      }
    }
    if (customerInformation) {
      con.push({
        $match: {
          descriptionENG: {
            $regex: new RegExp(customerInformation, "i")
          }
        }
      })
    }
    if (customerName) {
      con.push({
        $match: {
          customerName: {
            $regex: new RegExp(customerName, "i")
          }
        }
      })
    }
    if (ktcAnalysisResult) {
      con2 = [
        {
          $lookup:
          {
            from: "results",
            let: {
              local1: "$registerNo",
              local2: "$no"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$registerNo",
                          "$$local1"
                        ]
                      },
                      {
                        $eq: ["$no", "$$local2"]
                      }
                    ]
                  }
                }
              }
            ],
            as: "results"
          }
        },
        {
          $addFields:
          {
            results: {
              $arrayElemAt: ["$results", 0]
            }
          }
        },
        {
          $match:
          {
            results: {
              $ne: null
            }
          }
        },
        {
          $match:
          {
            "results.ktcAnalysisResult": {
              $regex: new RegExp(ktcAnalysisResult, "i")
            }
          }
        },
        {
          $project: {
            "registerNo": "$registerNo",
            "no": "$no",
            "claimStatus": "$status",
            "PIC": "$analysisPIC.name",
            claimMonth: {
              $dateToString: {
                format: "%m-%Y",
                date: "$claimRegisterDate",
              },
            },
            "claimNo": "$claimNo",
            "modelNo": "$modelNo",
            "customerName": "$customerName",
            "occurredLocation": "$occurredLocation",
            "defect": "$descriptionENG",
            "qty": "$qty",
            "lotNo": "$productNo",
            "judgment": "$results.ktcJudgment",
          }
        }
      ]

    }
    if (judgment) {
      con2 = [
        {
          $lookup:
          {
            from: "results",
            let: {
              local1: "$registerNo",
              local2: "$no"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$registerNo",
                          "$$local1"
                        ]
                      },
                      {
                        $eq: ["$no", "$$local2"]
                      }
                    ]
                  }
                }
              }
            ],
            as: "results"
          }
        },
        {
          $addFields:
          {
            results: {
              $arrayElemAt: ["$results", 0]
            }
          }
        },
        {
          $match:
          {
            results: {
              $ne: null
            }
          }
        },
        {
          $match:
          {
            "results.ktcJudgment": {
              $regex: new RegExp(judgment, "i")
            }
          }
        },
        {
          $project: {
            "registerNo": "$registerNo",
            "no": "$no",
            "claimStatus": "$status",
            "PIC": "$analysisPIC.name",
            claimMonth: {
              $dateToString: {
                format: "%m-%Y",
                date: "$claimRegisterDate",
              },
            },
            "claimNo": "$claimNo",
            "modelNo": "$modelNo",
            "customerName": "$customerName",
            "occurredLocation": "$occurredLocation",
            "defect": "$descriptionENG",
            "qty": "$qty",
            "lotNo": "$productNo",
            "judgment": "$results.ktcJudgment",
          }
        }
      ]


    }

    if (con2.length >= 2) {
      if (status) {
        status = JSON.parse(status)
        con2.push({
          $match: {
            status: {
              $in: status
            }
          }
        })
      }
      const data = await CLAIM.aggregate(con2);
      res.json(data)
    } else {
      let con_addition = [
        {
          $lookup:
          {
            from: "results",
            let: {
              local1: "$registerNo",
              local2: "$no"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$registerNo",
                          "$$local1"
                        ]
                      },
                      {
                        $eq: ["$no", "$$local2"]
                      }
                    ]
                  }
                }
              }
            ],
            as: "results"
          }
        },
        {
          $addFields:
          {
            results: {
              $arrayElemAt: ["$results", 0]
            }
          }
        },
        {
          $project: {
            "registerNo": "$registerNo",
            "no": "$no",
            "claimStatus": "$status",
            "PIC": "$analysisPIC.name",
            claimMonth: {
              $dateToString: {
                format: "%m-%Y",
                date: "$claimRegisterDate",
              },
            },
            "claimNo": "$claimNo",
            "modelNo": "$modelNo",
            "customerName": "$customerName",
            "occurredLocation": "$occurredLocation",
            "defect": "$descriptionENG",
            "qty": "$qty",
            "lotNo": "$productNo",
            "judgment": "$results.ktcJudgment",
          }
        }
      ]
      if (status) {
        status = JSON.parse(status)
        con.push({
          $match: {
            status: {
              $in: status
            }
          }
        })
      }
      const data = await CLAIM.aggregate([...con, ...con_addition]);
      res.json(data)
    }

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
