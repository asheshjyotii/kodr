const { default: mongoose } = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017",
    );
    console.log("mongodb connected");
  } catch (error) {
    console.log("error in db", error);
  }
};

module.exports = connectDb;