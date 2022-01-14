const express = require("express");
const cors = require("cors");
const dbConnect = require("./dbConnect");

const app = express();
const PORT = process.env.PORT;
const URI = process.env.MONGOURI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
////////////////////////////////////
// Connect Database
////////////////////////////////////
dbConnect(URI);

app.listen(PORT, () => {
  console.log(`
  ⚡  Using Environment = ${process.env.NODE_ENV}
  🚀  Server is running
  🔉  Listening on port ${PORT}
`);
});
