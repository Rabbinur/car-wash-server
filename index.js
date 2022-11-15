const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("car-wash server is running");
});

app.listen(post, () => {
  console.log(`car-wash-server on the ${port}`);
});
