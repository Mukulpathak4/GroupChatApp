const Sequelize = require("sequelize");
const sequelize = require("../util/config.js");

const User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true, // Add unique constraint to email field
  },
  password: Sequelize.STRING,
  phoneNumber: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

module.exports = User;