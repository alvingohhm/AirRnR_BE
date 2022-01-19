const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

////////////////////////////////
// Restaurant Mock Data SEED
////////////////////////////////
//📣TO DO: route to be remove when production
router.get("/seed", restaurantController.seedMockData);
////////////////////////////////
// Restaurant Index Routes
////////////////////////////////
// Get /api/restaurant?page=3&size=20
// Get /api/restaurant?find=soup
router.get("/", restaurantController.getRestaurantWithQuery);
////////////////////////////////
// Restaurant Show Routes
////////////////////////////////
// Get /api/restaurant/123456
router.get("/:id", restaurantController.getRestaurantById);
////////////////////////////////
// Restaurant Show Routes
////////////////////////////////
// Get /api/restaurant/slots/123456?date=2022-01-22&pax=3
router.get("/slots/:id", restaurantController.getRestaurantSlots);
//////////////////////////////////
// Restaurant CREATE Routes
//////////////////////////////////
// POST /api/restaurant -> payload req.body
router.post("/", restaurantController.createNewRestaurant);

module.exports = router;
