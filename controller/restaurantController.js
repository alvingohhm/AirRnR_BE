const Restaurant = require("../models/restaurant");
const restaurantSeed = require("../data/restaurantSeed");

const restaurantController = {
  //insert mock data
  seedMockData: async (req, res) => {
    try {
      await Restaurant.deleteMany({});
      await Restaurant.create(restaurantSeed, (err, data) => {
        if (err) throw err;
        res.json({ status: "ok", msg: "Restaurant Mock Data Saved!" });
      });
    } catch (error) {
      console.error(error);
      res.json({
        status: "failed",
        msg: "Problem Saving Restaurant Mock Data!",
      });
    }
  },
};

module.exports = restaurantController;
