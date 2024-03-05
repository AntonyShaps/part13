const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
        model: Blog
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    if (!req.body.username) {
      return res.status(400).json({ error: 'New username not provided' })
    }

    user.username = req.body.username
    await user.save()
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});


module.exports = router