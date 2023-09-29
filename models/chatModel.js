const {Sequelize} = require("sequelize");
const sequelize = require("../util/config");

const Chat = sequelize.define("chats", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=Chat;