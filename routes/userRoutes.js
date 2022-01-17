const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

////////////////////////////////
// User Mock Data SEED
////////////////////////////////
//📣TO DO: route to be remove when production
router.get("/seed", userController.seedMockData);

////////////////////////////////
// User Registration Routes
////////////////////////////////
router.post("/", userController.registerUserHandler);
////////////////////////////////
// User Show Routes - Auth
////////////////////////////////
router.get("/profile", protect, userController.userProfileHandler);
////////////////////////////////
// User Login Authentication
////////////////////////////////
router.post("/login", userController.loginHandler);

module.exports = router;
