const express = require("express");
const cors = require("cors");
const dbConnect = require("./dbConnect");
//api Resolver Controller
const restaurantController = require("./controller/restaurantController");

const app = express();
const PORT = process.env.PORT; //express port to listen to
const URI = process.env.MONGOURI; //mongodb uri base on environment
////////////////////////////////////
// Middleware
////////////////////////////////////
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
////////////////////////////////////
// Connect Database
////////////////////////////////////
dbConnect(URI);
////////////////////////////////
// Restaurant Mock Data SEED
////////////////////////////////
// const Test = require("./models/test");
// const testSeed = require("./data/testSeed");
// app.get("/api/test/seed", async (req, res) => {
//   try {
//     await Test.deleteMany({});
//     // await Test.collection.drop();
//     await Test.create(testSeed, (err, data) => {
//       if (err) throw err;
//       console.log("added provided data");
//       res.json({ status: "ok", msg: "Seed Data Saved!" });
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ status: "not ok", msg: "error saving data" });
//   }
// });

app.get("/restaurant/api/seed", restaurantController.seedMockData);

app.listen(PORT, () => {
  console.log(`
  ⚡  Using Environment = ${process.env.NODE_ENV}
  🚀  Server is running
  🔉  Listening on port ${PORT}
`);
});
