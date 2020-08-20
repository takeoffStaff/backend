const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('block', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    }
  }, {
    timestamps: false
  })
}