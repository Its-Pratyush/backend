const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://pratyushgogoi3:hello@cluster0.lhhujdy.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to db successfully");
  } catch (error) {
    console.error("error connecting to database", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
