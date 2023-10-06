const Sequelize = require('sequelize');

const sequelize = require('../util/config');

const Group = sequelize.define('groups', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: Sequelize.STRING,
    createdBy: Sequelize.STRING,
  });
  
  module.exports = Group;