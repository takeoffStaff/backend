const jwt = require('jsonwebtoken')
const config = require('config')

function getIdParam(req) {
  const id = req.params.id
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10)
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`)
}

function createToken(userId) {
  return jwt.sign(
    { userId },
    config.get('jwtSecret'),
    { expiresIn: '1h' },
  )
}

function getPagination(page, size) {
  let realPage = page
  if (page > 0) {
    realPage--
  }
  const limit = size ? +size : 3
  const offset = page ? realPage * limit : 0

  return { limit, offset }
}

function getPagingData(data, page, limit) {
  const { count: totalItems, rows } = data
  const currentPage = page ? +page : 1
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, data: rows, currentPage, totalPages, perPage: limit }
}

module.exports = {
  getIdParam,
  createToken,
  getPagination,
  getPagingData
}