const express = require("express");
const cors = require("cors");
const dbConnect = require("./dbConnect");
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

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

//////////////////////////////////
// Restaurant Router
//////////////////////////////////
//refer to restaurantRoutes.js for all the endpoints
//📣TO DO: to change the routes from api/restaurant to api/restaurants (pural)
app.use("/api/restaurant", restaurantRoutes);

//////////////////////////////////
// User Router
//////////////////////////////////
//refer to userRoutes.js for all the endpoints
app.use("/api/users", userRoutes);

//////////////////////////////////
// Catach all other routes
//////////////////////////////////
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

app.listen(PORT, () => {
  console.log(`
  ⚡  Using Environment = ${process.env.NODE_ENV}
  🚀  Server is running
  🔉  Listening on port ${PORT}
`);
});
