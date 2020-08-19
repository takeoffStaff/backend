const { models } = require('../../sequelize')
const { Op } = require('sequelize')
const { getIdParam, getPagination, getPagingData, createToken } = require('../helpers')
const { omit } = require('lodash')

// Get all users [START]
async function getAll(req, res) {

  const { userId } = req.user
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)

  const users = await models.user.findAndCountAll({
    limit,
    offset,
    where: {
      id: { [Op.ne]: userId }
    },
    include: [{
      model: models.image,
      attributes: ['url', 'id']
    }],
    attributes: {
      exclude: ['password', 'updatedAt']
    }
  })

  const response = getPagingData(users, page, limit)

  return res.json(response)
}
// Get all users [END]


// Get user by ID [START]
async function getById(req, res) {
  const id = getIdParam(req)

  const user = await models.user.findByPk(id, {
    include: [{
      model: models.image,
      attributes: ['url', 'id']
    }],
    attributes: {
      exclude: ['password', 'updatedAt']
    }
  })

  if (!user) {
    return res.status(401).json({ message: 'Пользователь не найден' })
  }

  return res.json(user)
}
// Get user by ID [END]


// Update an user [START]
async function update(req, res) {
  const id = getIdParam(req)

  // We only accept an UPDATE request if the `:id` param matches the body `id`
  if (req.body.id === id) {

    const user = await models.user.findByPk(id)

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' })
    }

    await user.update(req.body, { where: { id } })
    await user.setImage(req.body.image)

    const updatedUser = await models.user.findByPk(id, {
      include: [{
        model: models.image,
        attributes: ['url', 'id']
      }]
    })

    const token = createToken(user.id)

    return res.json({
      ...omit(updatedUser.toJSON(), ['password', 'createdAt', 'updatedAt']),
      token,
    })
  } else {
    res.status(400).json({ message: `Параметр ID: ${id} и body ID: ${req.body.id} не совпадают` })
  }
}
// Update an user [END]

module.exports = {
  getAll,
  getById,
  update,
}