require("dotenv").config();
const express = require("express");
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

Chat.belongsTo(User);
User.hasMany(Chat);

Group.belongsToMany(User, { through: GroupMember });
User.belongsToMany(Group, { through: GroupMember });

Chat.belongsTo(Group);
Group.hasMany(Chat);


app.use(cors({
    origin: "*"
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/",loginRoute);
app.use("/home",homeRoute);
app.use("/chat",chatRoute);
app.use("/token",tokenRoute);


sequelize.sync()
    // sequelize.sync({ force: true })
    .then(async () => {

        User.findAndCountAll()
            .then(async (result) => {
                if (result.count == 0) {
                    await User.create({ name: "Public", email: "null", phone: "public", password: "public" })
                    await Group.create({ groupname: "Public", creator: 1 })
                    await GroupMember.create({ groupGroupid: 1, userId: 1 })
                }
                app.listen(3000);
            })
    })
    .catch(err => console.log(err));