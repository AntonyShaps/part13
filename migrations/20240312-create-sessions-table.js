const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions');
  },
};