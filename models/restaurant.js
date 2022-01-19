const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    postal: { type: String, required: true },
    neighborhood: { type: String },
    img: { type: String, required: true },
    phoneno: { type: String },
    openhrs: [
      {
        start: { type: String },
        end: { type: String },
      },
    ],
    geolocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    rating: { type: Number, default: 0 },
    priceCat: { type: Number, default: 0 },
    cuisine_type: [{ type: String }],
    tags: [{ type: String }],
    availability: { type: Boolean },
    tables: [
      {
        no: { type: Number },
        capacity: { type: Number },
        allocated: [
          {
            from: { type: Number },
            to: { type: Number },
            duration: { type: Number },
          },
        ],
      },
    ],
    menuItems: [
      {
        posId: { type: Number },
        name: { type: String },
        description: { type: String },
        img: { type: String },
        category: { type: String },
        price: { type: Number, min: 0 },
        prepareTime: { type: Number, min: 2 },
        available: { type: Boolean },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("restaurant", restaurantSchema);
