let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const CLAIM = require("../models/claim");
const RESULT = require("../models/result");
let axios = require("axios");
const moment = require("moment");


router.get("/getRgas1", async (req, res, next) => {
  try {
    let { access, status, no_status, registerNo, no, claimNo, PIC, modelNo, modelName, claimMonth, customerInformation, customerName, ktcAnalysisResult, judgment, returnStyle, limit = 10, skip = 0, sort = -1, len = null, filterHeaders, sortHeaders } = req.query

    let con = [
      {
        $match: {
          // active: active
        }
      }
    ]
    let con2 = []
    let con3_paginator = [
      // {
      //   $sort: {
      //     registerNo: Number(sort),
      //     no: 1
      //   }
      // },
      {
        $skip: Number(skip)
      },
      {
        $limit: Number(limit)
      }
    ]
    if (len) {
      con3_paginator = [
        {
          $count: 'count'
        }
      ]
    }
    let con4_filterHeaders = []
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
    if (no_status) {
      no_status = JSON.parse(no_status)
      con.push({
        $match: {
          status: {
            $nin: no_status
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
    if (returnStyle) {
      con.push({
        $match: {
          returnStyle: {
            $regex: new RegExp(returnStyle, "i")
          }
        }
      })
    }
    if (claimMonth) {
      let dateStr = claimMonth.trim()
      dateStr = dateStr ? dateStr.split(',') : null
      if (dateStr && dateStr.length == 2) {
        con.push({
          $match: {
            claimRegisterDate: {
              $gte: moment(dateStr[0]).startOf('month').toDate(),
              $lte: moment(dateStr[1]).endOf('month').toDate()
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

    // ! con2
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
      ]


    }
    // ! con2
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
        $lookup: {
          from: "document-verifies",
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
          as: "document"
        }
      },
      {
        $addFields:
        {
          document: {
            $arrayElemAt: ["$document", 0]
          }
        }
      },
      {
        $lookup: {
          from: "reports",
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
          as: "reports"
        }
      },
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

    let mappingData = [
      {
        $project: {
          "PIC": "$analysisPIC.name",
          "claimStatus": "$status",
          "defect": "$results.ktcAnalysisResult",
          "lotNo": "$productLotNo",
          "judgment": "$results.ktcJudgment",
          "registerNo": 1,
          "no": 1,
          "status": 1,
          "results": 1,
          "reports": 1,
          "claimNo": 1,
          "modelNo": 1,
          "customerName": 1,
          "occurredLocation": 1,
          "returnStyle": 1,
          "qty": 1,
          monthNumber: { $dateToString: { format: "%m", date: "$claimRegisterDate" } }, // ดึงค่าของเดือนเป็นตัวเลข
          yearTwoDigits: { $substr: [{ $dateToString: { format: "%Y", date: "$claimRegisterDate" } }, 2, 2] }, // ดึงสองตัวสุดท้ายของปี
          "claimMonth": {
            $concat: [
              {
                $arrayElemAt: [
                  ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  { $toInt: { $dateToString: { format: "%m", date: "$claimRegisterDate" } } }
                ]
              },
              "-",
              { $substr: [{ $dateToString: { format: "%Y", date: "$claimRegisterDate" } }, 2, 2] } // ตัดปีเป็นสองตัว
            ]
          },
          "docStatus": {
            "$cond": [
              {
                "$and": [
                  { "$ne": [{ "$ifNull": ["$document.apply", ""] }, ""] },
                  { "$ne": [{ "$ifNull": ["$document.revise", ""] }, ""] },
                  { "$ne": [{ "$ifNull": ["$document.verify", ""] }, ""] }
                ]
              },
              "Closed",
              "Pending"
            ]
          },

          "claimStatus": "$status"
        }
      }
    ]
    if (filterHeaders) {
      filterHeaders = JSON.parse(filterHeaders)
      filterHeaders.forEach(fh => {
        if (fh.key == 'no' || fh.key == 'qty') {
          con4_filterHeaders.push({
            $match: {
              [fh.key]: parseInt(fh.value)
            }
          })
        } else {
          con4_filterHeaders.push({
            $match: {
              [fh.key]: { $regex: fh.value, $options: 'i' }
            }
          })
        }
      });
    }

    let con5 = []
    if (sortHeaders) {
      sortHeaders = JSON.parse(sortHeaders)
      sortHeaders.forEach(fh => {
        if (con5.length != 0) {
          con5[0]['$sort'][fh.key] = fh.value
        } else {
          con5.push({
            $sort: {
              [fh.key]: fh.value
            }
          })
        }
      });
    }
    let allCondition = [...con, ...con_addition, ...mappingData, ...con2, ...con4_filterHeaders, ...con5, ...con3_paginator]
    const data = await CLAIM.aggregate(allCondition);
    res.json(data)

  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
