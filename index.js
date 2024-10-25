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

// dotenv.config({ path: `.env` });
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

app.use("/auth", require("./src/routes/auth"));

app.use("/users", jwtValidate, require("./src/routes/users"));

app.use("/models", jwtValidate, require("./src/routes/models"));

app.use("/masters", jwtValidate, require("./src/routes/masters"));

app.use("/defect", jwtValidate, require("./src/routes/defect"));

app.use("/claim", jwtValidate, require("./src/routes/claim"));

app.use("/claim2", jwtValidate, require("./src/routes/claim2"));

app.use("/result", jwtValidate, require("./src/routes/result"));

app.use("/d-cd", jwtValidate, require("./src/routes/d-cd"));

app.use("/s-cd", jwtValidate, require("./src/routes/s-cd"));

app.use("/l-cd", jwtValidate, require("./src/routes/l-cd"));

app.use("/m1e", jwtValidate, require("./src/routes/m1e"));

app.use("/r-principle", jwtValidate, require("./src/routes/r-principle"));

app.use("/report", jwtValidate, require("./src/routes/report"));

app.use("/reportInformation", jwtValidate, require("./src/routes/reportInformation"));

app.use("/mail", jwtValidate, require("./src/routes/mail"));

app.use("/document-verify", jwtValidate, require("./src/routes/document-verify"));

app.use("/models-common", jwtValidate, require("./src/routes/models-common"));

app.use("/estimate-shipment", jwtValidate, require("./src/routes/estimate-shipment"));

app.use("/mail-tasks", jwtValidate, require("./src/routes/mail-tasks"));


app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST ,PUT ,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-with,Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

module.exports = app;
