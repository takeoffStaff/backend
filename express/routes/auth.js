const { models } = require('../../sequelize')
const { createToken } = require('../helpers')
const { validationResult } = require('express-validator')
const { omit } = require('lodash')
const config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// User registration [START]
async function registration(req, res) {
  if (req.body.id) {

    return res.status(400).json({ message: 'Вы не можете передавать ID. Он создается базой данных автоматически' })

  } else {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при регистрации',
      })
    }

    const { email, password } = req.body

    const candidate = await models.user.findOne({ where: { email } })

    if (candidate) {
      return res.status(400).json({
        message: 'Пользователь с таким email уже существует',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await models.user.create({ ...req.body, password: hashedPassword })

    const token = createToken(user.id)

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      image: null,
      token,
    })
  }
}
// User registration [END]


// User authorization [START]
async function login(req, res) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: 'Некорректные данные при входе в систему',
    })
  }

  const { email, password } = req.body

  const user = await models.user.findOne({
    where: { email },
    include: [
      {
        model: models.image,
        attributes: ['url', 'id']
      }
    ],
  })

  if (!user) {
    return res.status(400).json({ message: 'Пользователь с таким email не найден' })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(400).json({ message: 'Неверный e-mail или пароль' })
  }

  const token = createToken(user.id)

  res.json({
    ...omit(user.toJSON(), ['password', 'createdAt', 'updatedAt']),
    token,
  })
}
// User authorization [END]


// Сheck user authorization [START]
async function check(req, res) {
  const token = req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Не авторизованный пользователь' })
  }

  const decoded = jwt.verify(token, config.get('jwtSecret'), (err, authData) => {
    if (err) {
      return res.status(401).json({ message: 'Вы не прошли авторизацию' })
    } else {
      return authData
    }
  })

  const user = await models.user.findByPk(decoded.userId, {
    include: [{
      model: models.image,
      attributes: ['url', 'id']
    }]
  })

  if (!user) {
    return res.status(400).json({ message: 'Пользователь не найден' })
  }

  const newToken = createToken(user.id)

  res.json({
    ...omit(user.toJSON(), ['password', 'createdAt', 'updatedAt']),
    token: newToken,
  })
}
// Сheck user authorization [END]

module.exports = {
  registration,
  login,
  check,
}
