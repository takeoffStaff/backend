function applyExtraSetup(sequelize) {
  const { user, image, article, block } = sequelize.models

  user.hasOne(image, { onDelete: 'cascade' })

  user.hasMany(article, { onDelete: 'cascade' })

  article.belongsTo(user, {
    onDelete: 'cascade',
    as: 'author',
    foreignKey: 'userId'
  })

  article.hasMany(block, { onDelete: 'cascade' })

  block.belongsTo(article, {
    foreignKey: 'articleId'
  })

}

module.exports = { applyExtraSetup }