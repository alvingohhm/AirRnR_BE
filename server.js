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
app.get("/api/restaurant/seed", restaurantController.seedMockData);
////////////////////////////////
// Restaurant Index Routes
////////////////////////////////
// Get /api/restaurant?page=3&size=20
// Get /api/restaurant?find=soup
app.get("/api/restaurant", restaurantController.getRestaurantWithQuery);
////////////////////////////////
// Restaurant Show Routes
////////////////////////////////
// Get /api/restaurant/123456
app.get("/api/restaurant/:id", restaurantController.getRestaurantById);

app.listen(PORT, () => {
  console.log(`
  ⚡  Using Environment = ${process.env.NODE_ENV}
  🚀  Server is running
  🔉  Listening on port ${PORT}
`);
});
