const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

const SkladModel = require('./sklad.model')
class UserModel extends Model {
    toJSON () {//password ni ko'rsatmaslik uchun
    let values = Object.assign({}, this.get());
        delete values.password;
        return values;
    }
}

UserModel.init({
    id: { 
        type: Sequelize.DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    phone_number : {
        type: Sequelize.DataTypes.STRING(25),
        allowNull: false,
        unique: true
    },
    password : {
        type: Sequelize.DataTypes.STRING(60),
        allowNull: false,
    },
    fullname : {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
    },
    role : {
        type: Sequelize.DataTypes.ENUM('Admin', 'User', 'Programmer'),
        defaultValue: 'Admin'
    },
    sklad_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sklad',
            key: 'id'
        }
    },
    loginAt: {
        type: Sequelize.DataTypes.STRING(20)
    },
    token: {
        type: Sequelize.DataTypes.VIRTUAL,
    },
}, {
  sequelize,
  modelName: 'UserModel',
  tableName: 'user',
  timestamps: true,
  paranoid: true,
});
UserModel.belongsTo(SkladModel, {as: 'sklad', foreignKey: 'sklad_id',})
module.exports = UserModel;