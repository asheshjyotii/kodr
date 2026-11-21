require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const homeRoutes = require("./routes/home.routes");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cacheInstance = require("./config/redis");
const errorMiddleware = require("./middlewares/error.middleware");
const passport = require("passport");

const app = express();

connectDB();

cacheInstance.on("connect", () => {
  console.log("redis connected");
});

cacheInstance.on("error", (err) => {
  console.log("redis connection error", err);
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(passport.initialize());

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/main", homeRoutes);

app.use(errorMiddleware);

module.exports = app;
