const Sequelize = require('sequelize');
const sequelize = new Sequelize('gossipgrid', 'root', 'spsushila',{
  dialect :'mysql',
  host: 'localhost'
});

module.exports=sequelize;