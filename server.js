const express = require("express");
const cluster = require("cluster");
const { cpus } = require("os");
const morgan = require("morgan");
const createHttpError = require("http-errors");
const { nextTick } = require("process");
const authRoute = require("./src/Routes/auth.route");
require("dotenv").config();
require("./src/Helpers/init_mongodb");
const { verifyAccessToken } = require("./src/Helpers/jwt_helper");

const app = express();
const PORT = process.env.PORT || 8080;
const numOfCpus = cpus().length;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", verifyAccessToken, async (req, res) => {
  res.send("Hi, It's a home page!");
});

app.use("/auth", authRoute);

app.use(async (req, res, next) => {
  next(createHttpError.NotFound("Sorry! This route is not available."));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// if (cluster.isMaster) {
//   for (var cpu = 0; cpu < numOfCpus; cpu++) {
//     cluster.fork();
//     // console.log(process.pid);
//   }
//   cluster.on("exit", () => {
//     cluster.fork();
//   });
// } else {
//   app.listen(PORT, () => {
//     console.log(
//       `started on port:(Process: ${process.pid}) http://localhost:${PORT}`
//     );
//   });
// } // to make nodejs api scalable

app.listen(PORT, () => {
  console.log(
    `started on port:(Process: ${process.pid}) http://localhost:${PORT}`
  );
});
