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
  // get available slots for a specific restaurant
  getRestaurantSlots: async (req, res) => {
    let { date, pax } = req.query;

    let startDate, endDate;
    if (date) {
      startDate = new Date(
        date.slice(0, 4),
        Number(date.slice(4, 6)) - 1,
        date.slice(6, 8),
        8
      );
      startDate = startDate.getTime();
      endDate = startDate + 24 * 60 * 60 * 1000;
    }

    try {
      restaurantData = await Restaurant.find(
        {
          _id: req.params.id,
          tables: { $elemMatch: { capacity: { $gte: pax } } },
        },
        { tables: 1, name: 1, openhrs: 1 }
      );
    } catch (error) {
      console.error(error);
      res.json({
        status: "failed",
        msg: "Problem Getting Restaurant Data!",
      });
    }

    const tableArr = restaurantData[0].tables;

    function groupBy(xs, f) {
      return xs.reduce(
        (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
        {}
      );
    }

    const openTime = restaurantData[0].openhrs[0].start;
    const endTime = restaurantData[0].openhrs[0].end;
    const queryDate = new Date(startDate);
    const year = queryDate.getFullYear();
    const month = queryDate.getMonth();
    const day = queryDate.getDate();
    const openNumber = new Date(
      year,
      month,
      day,
      openTime.slice(0, 2),
      openTime.slice(3, 5)
    );
    const endNumber = new Date(
      year,
      month,
      day,
      endTime.slice(0, 2),
      endTime.slice(3, 5)
    );

    const slots = [];
    const availableSlots = {};
    for (
      let i = openNumber.getTime();
      i <= endNumber.getTime();
      i += 15 * 60 * 1000
    ) {
      slots.push(i);
    }
    slots.splice(-4, 0);
    const flatAvailable = [];

    for (const table of tableArr) {
      const tableNo = "Table" + table.no;
      availableSlots[tableNo] = slots;
      for (const booking of table.allocated) {
        if (booking.from >= startDate && booking.to <= endDate) {
          const position = availableSlots[tableNo].findIndex(
            (slot) => slot === booking.from
          );
          availableSlots[tableNo].splice(position, 3);
        }
      }
      for (i = 0; i < availableSlots[tableNo].length - 5; i++) {
        if (
          availableSlots[tableNo][i + 4] - availableSlots[tableNo][i + 3] ===
            15 * 60 * 1000 &&
          availableSlots[tableNo][i + 3] - availableSlots[tableNo][i + 2] ===
            15 * 60 * 1000 &&
          availableSlots[tableNo][i + 2] - availableSlots[tableNo][i + 1] ===
            15 * 60 * 1000 &&
          availableSlots[tableNo][i + 1] - availableSlots[tableNo][i] ===
            15 * 60 * 1000
        ) {
          flatAvailable.push(availableSlots[tableNo][i]);
        }
      }
    }

    const uniqueFlatAvailable = flatAvailable.filter(
      (data, index) => flatAvailable.indexOf(data) === index
    );

    res.json({
      status: "availability",
      data: uniqueFlatAvailable,
    });
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
