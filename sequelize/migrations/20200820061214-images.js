'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      url: Sequelize.STRING,
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        }
      },
    }, {
      timestamps: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable('images')
  }
}
