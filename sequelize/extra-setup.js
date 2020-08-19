function applyExtraSetup(sequelize) {
  const { user, image } = sequelize.models

  user.hasOne(image, { onDelete: 'cascade' })
}

module.exports = { applyExtraSetup }