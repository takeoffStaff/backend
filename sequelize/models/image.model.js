const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
    },
    userId: DataTypes.INTEGER,
  }, {
    timestamps: false
  })
}