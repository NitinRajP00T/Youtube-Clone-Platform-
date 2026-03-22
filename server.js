const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Handle uncaught exceptions
// process.on('uncaughtException', err => {
//     console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//     console.log(err.name, err.message);
//     process.exit(1);
// });

dotenv.config();
const app = require("./src/app");

const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

app.post("/", (req, res) => {
  //ternimal data
  console.log("body", req.body);
  console.log(" methord", req.method);
  console.log("url", req.url);
  console.log("header", req.headers);
  res.send("data recived");
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
