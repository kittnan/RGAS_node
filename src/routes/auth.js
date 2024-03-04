let express = require("express");
let router = express.Router();
var mongoose = require("mongodb");
const { ObjectId } = mongoose;
const USERS = require("../models/users");
let axios = require("axios");
const jwt = require("jsonwebtoken")

router.post("/login", async (req, res) => {
  try {
    const payload = req.body;
    let user = await USERS.aggregate([
      {
        $match: {
          employeeCode: payload.username,
          employeeCode: payload.password,
        },
      },
    ]);
    user = user?.length > 0 ? user[0] : null
    if (!user) {
      return res.sendStatus(400)
    }
    const access_token = jwtGenerate(user)
    const refresh_token = jwtRefreshTokenGenerate(user)
    const profile = user
    user.refresh = refresh_token

    res.json({
      access_token,
      refresh_token,
      profile

    })
  } catch (error) {
    console.log("🚀 ~ error:", error);
    res.sendStatus(500);
  }
})
const jwtGenerate = (user) => {
  const accessToken = jwt.sign(
    { name: user.employeeCode, id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m", algorithm: "HS256" }
  )
  return accessToken
}
const jwtRefreshTokenGenerate = (user) => {
  const refreshToken = jwt.sign(
    { name: user.employeeCode, id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d", algorithm: "HS256" }
  )

  return refreshToken
}
const jwtRefreshTokenValidate = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) return res.sendStatus(401)
    const token = req.headers["authorization"].replace("Bearer ", "")

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) throw new Error(err)
      req.user = decoded
      req.user.token = token
      delete req.user.exp
      delete req.user.iat
    })
    next()
  } catch (error) {
    console.log("🚀 ~ error:", error)
    return res.sendStatus(403)
  }
}
router.post("/refresh", jwtRefreshTokenValidate, async (req, res) => {
  let user = await USERS.aggregate([
    {
      $match: {
        employeeCode: req.user.name,
        _id: new ObjectId(req.user.id)
      }
    }
  ])
  user = user?.length > 0 ? user[0] : null
  if (!user) return res.sendStatus(401)

  const access_token = jwtGenerate(user)
  const refresh_token = jwtRefreshTokenGenerate(user)
  user.refresh = refresh_token

  return res.json({
    access_token,
    refresh_token,
  })
})

module.exports = router;
