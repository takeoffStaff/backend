function applyExtraSetup(sequelize) {
  const { user, image, article, block } = sequelize.models

  user.hasOne(image, { onDelete: 'CASCADE' })

  image.belongsTo(user, {
    onDelete: 'CASCADE',
    as: 'image',
    foreignKey: 'userId'
  })

  user.hasMany(article, { onDelete: 'CASCADE' })

  article.belongsTo(user, {
    onDelete: 'CASCADE',
    as: 'author',
    foreignKey: 'userId'
  })

  article.hasMany(block, { onDelete: 'CASCADE' })

  block.belongsTo(article, {
    foreignKey: 'articleId'
  })

}

module.exports = { applyExtraSetup }