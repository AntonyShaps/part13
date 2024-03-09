const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1991,
        max() {
            const currentYear = new Date().getFullYear()
            if(this.year > currentYear){
                throw new Error(`The year is out from allowable range`)
            }
        }
      },
    });
  },
  down: async ({context: queryInterface}) => {
    await queryInterface.removeColumn('blogs', 'year');
  },
};