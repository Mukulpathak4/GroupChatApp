require("dotenv").config();
const express = require("express");
const http = require("http"); // Import the HTTP module
const socketIo = require("socket.io"); // Import Socket.IO
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const homeRoute = require("./routes/homeRoutes");
const loginRoute = require("./routes/signupRoutes");
const chatRoute = require("./routes/chatRoutes");
const tokenRoute = require("./routes/tokenRoutes");
const path = require("path");
const sequelize = require("./util/config");
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const GroupMember = require("./models/groupMemberModel");

// Chat and user model associations (if you haven't done this already)
Chat.belongsTo(User);
User.hasMany(Chat);

// Group and user model associations (if you haven't done this already)
Group.belongsToMany(User, { through: GroupMember });
User.belongsToMany(Group, { through: GroupMember });

Chat.belongsTo(Group);
Group.hasMany(Chat);

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", loginRoute);
app.use("/home", homeRoute);
app.use("/chat", chatRoute);
app.use("/token", tokenRoute);

const server = http.createServer(app); // Create an HTTP server using Express app

const io = socketIo(server); // Attach Socket.IO to the HTTP server

io.on("connection", (socket) => {
  // Handle socket connections here
  console.log("A user connected");

  // Example: Listen for a chat message from the client and broadcast it to all connected clients
  socket.on("chat message", (message) => {
    io.emit("chat message", message); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

sequelize
  .sync()
  // sequelize.sync({ force: true })
  .then(async () => {
    User.findAndCountAll().then(async (result) => {
      if (result.count == 0) {
        await User.create({ name: "Public", email: "null", phone: "public", password: "public" });
        await Group.create({ groupname: "Public", creator: 1 });
        await GroupMember.create({ groupGroupid: 1, userId: 1 });
      }
      server.listen(3000, () => {
        console.log("Server is running on port 3000");
      });
    });
  })
  .catch((err) => console.log(err));
