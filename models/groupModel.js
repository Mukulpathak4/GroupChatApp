const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");
const sequelize = require("../util/config");

const Group= sequelize.define("groups",{
    groupid:{
        // type:Sequelize.UUID,
        // defaultValue: Sequelize.UUIDV4,
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupname:{
        type: Sequelize.STRING,
        allowNull:false
    },
    creator:{
        type:Sequelize.INTEGER,
    }
    
}
  )

module.exports=Group;