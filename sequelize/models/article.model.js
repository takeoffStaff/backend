const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('article', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 255],
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  })
}