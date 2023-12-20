const Sequelize = require('sequelize');
 const sequelize = require('../database');

 const dwnContent = sequelize.define('content', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey: true
    },
    fileUrl : Sequelize.STRING,
    
 })

 module.exports = dwnContent;