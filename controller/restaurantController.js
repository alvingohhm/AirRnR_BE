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
  //Querying and show list of restaurants for index page
  //limit default to 15 restaurants
  getRestaurantWithQuery: async (req, res) => {
    const { page = 1, size = 15, find } = req.query;
    let query = null;

    switch (true) {
      case find !== undefined:
        query = {
          $or: [
            { name: { $regex: req.query.find, $options: "i" } },
            { tags: { $regex: req.query.find, $options: "i" } },
          ],
          availability: true,
        };
        break;
      default:
        query = { availability: true };
        break;
    }
    try {
      await Restaurant.find(query)
        .sort({ rating: -1, createdAt: 1 })
        .limit(size * 1)
        .skip((page - 1) * size)
        .exec((err, response) => {
          if (err) throw err;
          if (response) {
            let data = null;
            Array.isArray(response) ? (data = response) : (data = [response]);
            res.json({
              status: "ok",
              msg: `Get Data Success! Page:${page} with ${data.length} records, limit to ${size} records`,
              data: data,
            });
          } else {
            res.json({
              status: "ok",
              msg: "The query did not return any result!",
            });
          }
        });
    } catch (error) {
      console.error(error);
      res.json({
        status: "failed",
        msg: "Problem getting data!",
      });
    }
  },
  //get a particular restaurant by id
  getRestaurantById: async (req, res) => {
    // console.log(req.body.id);
    try {
      await Restaurant.findById(req.params.id).exec((err, response) => {
        if (err) throw err;
        if (response) {
          let data = null;
          Array.isArray(response) ? (data = response) : (data = [response]);
          res.json({
            status: "ok",
            msg: `Get Data Success! Showing ${data.length} record`,
            data: data,
          });
        } else {
          res.json({
            status: "ok",
            msg: "The query did not return any result!",
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        status: "failed",
        msg: "Problem Getting Data!",
      });
    }
  },
  createNewRestaurant: async (req, res) => {
    try {
      await Restaurant.create(req.body, (err, response) => {
        if (err) throw err;
        if (response) {
          let data = null;
          Array.isArray(response) ? (data = response) : (data = [response]);
          res.json({
            status: "ok",
            msg: "New Restaurant Created!",
            data: data,
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        status: "failed",
        msg: "Problem Creating Data!",
      });
    }
  },
};

module.exports = restaurantController;
