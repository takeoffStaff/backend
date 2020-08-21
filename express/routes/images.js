const { models } = require('../../sequelize')

// Create an image [START]
async function create(req, res) {
  if (req.body.id) {

    return res.status(400).json({ message: 'Вы не можете передавать ID. Он создается базой данных автоматически' })

  } else {

    if (req.file == undefined) {
      return res.status(400).json({ message: 'Вы должны загрузить изображение' })
    }

    const image = await models.image.create({ url: '/' + req.file.path })

    return res.status(201).json(image)
  }
}
// Create an image [END]

module.exports = {
  create,
}