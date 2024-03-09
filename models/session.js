const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db')

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'session',
  underscored: true,
  timestamps: true
});

module.exports = Session;
