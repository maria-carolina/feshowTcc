const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const connection = new Sequelize(dbConfig);

//models
const User = require('../models/User');

//passando conexão
User.init(connection);

//passando models para as associações
User.associate(connection.models);

module.exports = connection;
