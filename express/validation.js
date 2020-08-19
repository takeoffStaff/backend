const { check } = require('express-validator')

const loginValidate = [
  check('email', '').exists(),
  check('password', '').exists(),
]

const registrationValidate = [
  check('email', 'Некорректный email').isEmail(),
  check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 }),
  check('name', 'Минимальная длина никнейм 3 символа').isLength({ min: 3 }),
  check('name', 'Максимальная длина никнейм 10 символов').isLength({ max: 10 })
]

module.exports = {
  loginValidate,
  registrationValidate,
}