const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');
const KontragentModel = require('./kontragent.model');
const PayTypeModel = require('./payType.model');
const RasxodTableModel = require('./rasxodTable.model');
const SkladModel = require('./sklad.model');
const UserModel = require('./user.model');
class RasxodModel extends Model {
}
RasxodModel.init({
  id: {
    autoIncrement: true,
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  created_at: {
    type: Sequelize.Sequelize.DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  updated_at: {
    type: Sequelize.Sequelize.DataTypes.INTEGER,
  },
  sklad_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'sklad',
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  },
  kontragent_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'kontragent',
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  },
  user_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'user',
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  },
  price_type: {
    type: Sequelize.DataTypes.ENUM('optom', 'chakana'),
    allowNull: true
  },
  skidka_summa: {
    type: Sequelize.DataTypes.DECIMAL(17, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  summa: {
    type: Sequelize.DataTypes.DECIMAL(17, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  comment: {
    type: Sequelize.DataTypes.STRING(50),
    allowNull: true
  },
  cash_summa: {
    type: Sequelize.DataTypes.DECIMAL(17, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  plastic_summa: {
    type: Sequelize.DataTypes.DECIMAL(17, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  count_all: {
    type: Sequelize.DataTypes.DECIMAL(17, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  daily_number: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true
  },
  // number: {
  //   type: Sequelize.DataTypes.INTEGER,
  //   allowNull: true,
  //   unique: true
  // },
  dollar_rate: {
    type: Sequelize.DataTypes.DECIMAL(17, 3),
    allowNull: true,
    defaultValue: 1.000
  },
  pay_type_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  },
  dollar_summa: {
    type: Sequelize.DataTypes.DECIMAL(17, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  refund_money: {
    type: Sequelize.DataTypes.DECIMAL(17, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  refund_money_dollar: {
    type: Sequelize.DataTypes.DECIMAL(17, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  from: {
    type: Sequelize.DataTypes.STRING(10),
    allowNull: true,
    defaultValue: "web"
  }
}, {
  sequelize,
  modelName: 'RasxodModel',
  tableName: 'rasxod',
  timestamps: false,
  paranoid: true,
});

RasxodModel.hasMany(RasxodTableModel, { as: 'rasxod_table', foreignKey: 'rasxod_id' });
RasxodModel.belongsTo(SkladModel, { as: 'sklad', foreignKey: 'sklad_id' });
RasxodModel.belongsTo(KontragentModel, { as: 'kontragent', foreignKey: 'kontragent_id' });
RasxodModel.belongsTo(PayTypeModel, { as: 'pay_type', foreignKey: 'pay_type_id' });
RasxodModel.belongsTo(UserModel, { as: 'user', foreignKey: 'user_id' });
UserModel.hasMany(RasxodModel, { as: 'rasxod', foreignKey: 'user_id' });

module.exports = RasxodModel;