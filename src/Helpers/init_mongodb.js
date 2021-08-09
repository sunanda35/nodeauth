const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Mongodb Connected!");
  })
  .catch((err) => {
    console.log(err.message);
  });
mongoose.connection.on("connected", () => {
  console.log("Mongodb connected to database");
});
mongoose.connection.on("error", (err) => {
  console.log(err.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongodb disconnected");
});
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
