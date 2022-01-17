const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

////////////////////////////////
// User Mock Data SEED
////////////////////////////////
//📣TO DO: route to be remove when production
router.get("/seed", userController.seedMockData);

////////////////////////////////
// User Show Routes
////////////////////////////////
// Get /api/users/123456
router.get("/:id", userController.getUserById);
////////////////////////////////
// User Login Authentication
////////////////////////////////
router.post("/login", userController.authUser);

module.exports = router;
