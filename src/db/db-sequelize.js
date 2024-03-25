const { Sequelize } = require('sequelize');
const config = require('../startup/config');

const sequelize = new Sequelize(
    config.db_name, 
    config.db_user, 
    config.db_pass,
    {
        host:  config.host,
        port: config.db_port,
        dialect: 'mysql',
        dialectOptions:{
            decimalNumbers: true,
            multipleStatements: true
        },
        logging: (msg) => config.node_env === 'development' ? console.log(msg) : false
    }
);


module.exports = sequelize;