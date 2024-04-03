let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
let app = express();
let morgan = require("morgan");
let mongoose = require("mongoose");
let compression = require("compression");
const jwt = require("jsonwebtoken")

mongoose.set("strictQuery", false);

const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
console.log("PORT:", process.env.PORT);
let mongooseConnect = require("./connect");
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log("Listening on  port " + server.address().port);
});

const jwtValidate = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) return res.sendStatus(401);

    const token = req.headers["authorization"].replace("Bearer ", "");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err.message);
        return res.sendStatus(403); // Forbidden
      }
      next(); // Move to the next middleware
    });
  } catch (error) {
    console.error("JWT validation error:", error.message);
    return res.sendStatus(403); // Forbidden
  }
};

app.use(morgan("tiny"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(compression());

let Auth = require("./src/routes/auth");
app.use("/auth", Auth);

let Users = require("./src/routes/users");
app.use("/users", jwtValidate, Users);

let Models = require("./src/routes/models");
app.use("/models", jwtValidate, Models);

let MASTER = require("./src/routes/masters");
app.use("/masters", jwtValidate, MASTER);

let DEFECT = require("./src/routes/defect");
app.use("/defect", jwtValidate, DEFECT);

let CLAIM = require("./src/routes/claim");
app.use("/claim", jwtValidate, CLAIM);

let RESULT = require("./src/routes/result");
app.use("/result", jwtValidate, RESULT);

let D_CD = require("./src/routes/d-cd");
app.use("/d-cd", jwtValidate, D_CD);

let S_CD = require("./src/routes/s-cd");
app.use("/s-cd", jwtValidate, S_CD);

let L_CD = require("./src/routes/l-cd");
app.use("/l-cd", jwtValidate, L_CD);

let M1E = require("./src/routes/m1e");
app.use("/m1e", jwtValidate, M1E);

let R_PRINCIPLE = require("./src/routes/r-principle");
app.use("/r-principle", jwtValidate, R_PRINCIPLE);

let REPORT = require("./src/routes/report");
app.use("/report", jwtValidate, REPORT);

let REPORT_INFO = require("./src/routes/reportInformation");
app.use("/reportInformation", jwtValidate, REPORT_INFO);

let mail = require("./src/routes/mail");
app.use("/mail", jwtValidate, mail);

let DOCUMENT_VERIFY = require("./src/routes/document-verify");
app.use("/document-verify", jwtValidate, DOCUMENT_VERIFY);


let Models_Common = require("./src/routes/models-common");
app.use("/models-common", jwtValidate, Models_Common);


let MAIL_TASKS = require("./src/routes/mail-tasks");
app.use("/mail-tasks", jwtValidate, MAIL_TASKS);


app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST ,PUT ,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-with,Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

module.exports = app;
