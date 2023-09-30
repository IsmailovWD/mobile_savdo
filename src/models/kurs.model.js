const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

class KursModel extends Model {
    toJSON () {//summani floatga olish uchun
    let values = Object.assign({}, this.get());
        if(typeof values.summa === 'string'){
            values.summa = parseFloat(values.summa);
        }
        return values;
    }
}
KursModel.init({
    id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    summa: {
        type: Sequelize.DataTypes.DECIMAL(11,2),
        allowNull: false
    },
    datetime: {
        type: Sequelize.DataTypes.STRING(30),
        allowNull: false
    }
}, {
  sequelize,
  modelName: 'KursModel',
  tableName: 'kurs',
  timestamps: false,
  paranoid: true,
});
module.exports = KursModel;