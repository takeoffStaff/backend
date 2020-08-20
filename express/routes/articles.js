const { models } = require('../../sequelize')
const { getIdParam, getPagination, getPagingData } = require('../helpers')

// Get all articles [START]
async function getAll(req, res) {

  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)

  const articles = await models.article.findAndCountAll({
    limit,
    offset,
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: models.user,
      as: 'author',
      attributes: ['id', 'name']
    }],
    attributes: {
      exclude: ['userId']
    }
  })

  const response = getPagingData(articles, page, limit)

  res.json(response)
}
// Get all articles [END]


// Get article by ID [START]
async function getById(req, res) {
  const id = getIdParam(req)

  const article = await models.article.findByPk(id, {
    include: [{
      model: models.block,
      attributes: ['type', 'data']
    },
    {
      model: models.user,
      as: 'author',
      attributes: ['id', 'name']
    }],
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'userId']
    },
  })

  if (!article) {
    return res.status(400).json({ message: 'Статья не найдена' })
  }

  res.json(article)
}
// Get article by ID [END]


// Create an article [START]
async function create(req, res) {
  if (req.body.id) {
    return res.status(400).json({ message: 'Вы не можете передавать ID. Он создается базой данных автоматически' })
  } else {

    const { userId } = req.user
    const { blocks } = req.body

    const createdArticle = await models.article.create({ ...req.body, userId })

    await Promise.all(blocks.map((block) => {
      return models.block.create({ ...block, articleId: createdArticle.id })
    }))

    const article = await models.article.findByPk(createdArticle.id, {
      include: [{
        model: models.block,
        attributes: ['type', 'data']
      },
      {
        model: models.user,
        as: 'author',
        attributes: ['id', 'name']
      }],
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt']
      }
    })

    res.status(201).json(article)
  }
}
// Create an article [END]


// Update an article [START]
async function update(req, res) {
  const articleId = getIdParam(req)

  // We only accept an UPDATE request if the `:id` param matches the body `id`
  if (req.body.id === articleId) {

    const { blocks } = req.body

    const article = await models.article.findByPk(articleId)

    if (!article) {
      return res.status(400).json({ message: 'Статья не найдена' })
    }

    await article.update(req.body, { where: { id: articleId } })

    await models.block.destroy({ where: { articleId } })

    await Promise.all(blocks.map((block) => {
      return models.block.create({ ...block, articleId })
    }))

    const updatedArticle = await models.article.findByPk(articleId, {
      include: [{
        model: models.block,
        attributes: ['type', 'data']
      },
      {
        model: models.user,
        as: 'author',
        attributes: ['id', 'name']
      }],
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt']
      }
    })

    res.status(201).json(updatedArticle)
  } else {
    res.status(400).json({ message: `Параметр ID: ${id} и body ID: ${req.body.id} не совпадают` })
  }
}
// Update an article [END]


// Delete an article [START]
async function remove(req, res) {
  const id = getIdParam(req)
  await models.article.destroy({
    where: { id }
  })
  res.json({ message: 'Статья удалена' })
}
// Delete an article [END]

module.exports = {
  getAll,
  getById,
  update,
  create,
  remove,
}