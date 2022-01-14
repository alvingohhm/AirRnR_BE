const mongoose = require("mongoose");

// Connect to Mongodb
const dbConnect = async (mongoURI) => {
  try {
    await mongoose.connect(
      mongoURI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) throw err;
        console.log("The connection with mongod is established");
      }
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
