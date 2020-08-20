const express = require('express')
const bodyParser = require('body-parser')
const authMiddleware = require('./middleware/auth.middleware')
const uploadFileMiddleware = require('./middleware/uploadFile.middleware')
const path = require('path')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(__dirname, '/public')))

function makeHandlerAwareOfAsyncErrors(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res)
    } catch (error) {
      next(error)
    }
  }
}

// Define the standard REST APIs for each route (if they exist) [START]
const routes = {
  users: require('./routes/users'),
  articles: require('./routes/articles')
}

for (const [routeName, routeController] of Object.entries(routes)) {
  if (routeController.getAll) {
    app.get(
      `/api/${routeName}`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.getAll)
    )
  }
  if (routeController.getById) {
    app.get(
      `/api/${routeName}/:id`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.getById)
    )
  }
  if (routeController.create) {
    app.post(
      `/api/${routeName}`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.create)
    )
  }
  if (routeController.update) {
    app.put(
      `/api/${routeName}/:id`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.update)
    )
  }
  if (routeController.remove) {
    app.delete(
      `/api/${routeName}/:id`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.remove)
    )
  }
}
// Define the standard REST APIs for each route (if they exist) [END]


// Define the auth routes [START]
const authController = require('./routes/auth')
const { loginValidate, registrationValidate } = require('./validation')

app.post(
  '/api/auth/registration',
  registrationValidate,
  makeHandlerAwareOfAsyncErrors(authController.registration)
)

app.post(
  '/api/auth/login',
  loginValidate,
  makeHandlerAwareOfAsyncErrors(authController.login)
)

app.get(
  '/api/auth/check',
  makeHandlerAwareOfAsyncErrors(authController.check)
)
// Define the auth routes [END]


// Define the upload file routes [START]
const imageController = require('./routes/images')

app.post(
  '/api/upload/images',
  authMiddleware,
  uploadFileMiddleware.image.single('image'),
  makeHandlerAwareOfAsyncErrors(imageController.create)
)
// Define the upload file routes [END]

module.exports = app