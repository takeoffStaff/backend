const { Sequelize } = require('sequelize')
const { applyExtraSetup } = require('./extra-setup')
const config = require('config')

const dbConfig = config.get('dbConfig')

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logQueryParameters: true,
  benchmark: true,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
})

const modelDefiners = [
  require('./models/user.model'),
  require('./models/image.model'),
  require('./models/article.model'),
  require('./models/block.model'),
]

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize)
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize)

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize