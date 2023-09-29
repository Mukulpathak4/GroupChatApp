const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const signupRoutes = require("./routes/signupRoutes");
const homeRoutes = require("./routes/homeRoutes");
const sequelize = require("./util/config");

const chatRouter = require("./routes/chatRoutes");

const Chat = require("./models/chatModel")
const User = require("./models/userModel")
const Group = require("./models/groupModel")
const GroupMember = require("./models/groupMemberModel")




// const cors = require("cors");
require('dotenv').config(); // Load environment variables from .env file

const PORT = 3000;


app.use("/", signupRoutes);

app.use("/home", homeRoutes);

app.use("/",chatRouter);

Chat.belongsTo(User);
User.hasMany(Chat);

Group.belongsToMany(User, { through: GroupMember });
User.belongsToMany(Group, { through: GroupMember });

Chat.belongsTo(Group);
Group.hasMany(Chat);

sequelize
  .sync() // This method synchronizes the database schema with the defined models.
  .then((result) => {
    app.listen(process.env.PORT ||PORT); // Start the Express app on port 3200.
    console.log("Server Started");
  })
  .catch((err) => console.log(err)); // Handle any errors that occur during synchronization.