const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const signupRoutes = require("./routes/signupRoutes");
const sequelize = require("./util/config");

const cors = require("cors");
require('dotenv').config(); // Load environment variables from .env file

const PORT = 3000;

app.use("/", signupRoutes);

sequelize
  .sync() // This method synchronizes the database schema with the defined models.
  .then((result) => {
    app.listen(process.env.PORT ||PORT); // Start the Express app on port 3200.
    console.log("Server Started");
  })
  .catch((err) => console.log(err)); // Handle any errors that occur during synchronization.