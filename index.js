let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
let app = express();
let morgan = require("morgan");
let mongoose = require("mongoose");
let compression = require("compression");

mongoose.set("strictQuery", false);

const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
console.log("PORT:", process.env.PORT);
let mongooseConnect = require("./connect");
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log("Listening on  port " + server.address().port);
});

app.use(morgan("tiny"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(compression());

let Users = require("./src/routes/users");
app.use("/users", Users);

let Models = require("./src/routes/models");
app.use("/models", Models);

let MASTER = require("./src/routes/masters");
app.use("/masters", MASTER);

let DEFECT = require("./src/routes/defect");
app.use("/defect", DEFECT);

let CLAIM = require("./src/routes/claim");
app.use("/claim", CLAIM);

let RESULT = require("./src/routes/result");
app.use("/result", RESULT);

let D_CD = require("./src/routes/d-cd");
app.use("/d-cd", D_CD);

let S_CD = require("./src/routes/s-cd");
app.use("/s-cd", S_CD);

let L_CD = require("./src/routes/l-cd");
app.use("/l-cd", L_CD);

let M1E = require("./src/routes/m1e");
app.use("/m1e", M1E);

let R_PRINCIPLE = require("./src/routes/r-principle");
app.use("/r-principle", R_PRINCIPLE);

let REPORT = require("./src/routes/report");
app.use("/report", REPORT);



app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST ,PUT ,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-with,Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

module.exports = app;
