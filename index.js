const app = require('./express/app')
const sequelize = require('./sequelize')
const config = require('config')

const PORT = process.env.PORT || config.get('port')

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`)
  try {
    await sequelize.authenticate()
    console.log('Database connection OK!')
  } catch (error) {
    console.log('Unable to connect to the database:')
    console.log(error.message)
    process.exit(1)
  }
}

async function init() {
  await assertDatabaseConnectionOk()

  console.log(`Starting server on port ${PORT}...`)

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
}

init()