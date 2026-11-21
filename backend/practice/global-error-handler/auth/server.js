const app = require("./src/app");
const connectDB = require("./src/config/db");
const cacheInstance = require("./src/config/redis");



app.listen(3000, () => {
  console.log("server is running on port 3000");
});
