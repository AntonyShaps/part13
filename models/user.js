const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
        isEmail: {
          msg: "Validation isEmail on username failed" // Custom error message
        }
      }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  defaultScope: {
    attributes: {exclude: ['createdAt', 'updatedAt']}
  },
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

module.exports = User