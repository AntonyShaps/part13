const router = require('express').Router()

const { BelongsTo } = require('sequelize')
const { User } = require('../models')
const { Blog } = require('../models')
const { ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: ['name', 'username'],
    include: [
      {
        model: Blog,
        attributes: {exclude: ['userId', 'createdAt', 'updatedAt']}
      },
      {
        model: Blog,
        as: 'reading',
        attributes: {exclude: ['userId', 'createdId', 'updatedAt']},
        through: {
          attributes: [],
        }
      }
    ]
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
  const { id } = req.params
  const where = {
    id,
    '$readings.readingLists.user_id$': id,
  };

  if (req.query.read === 'true') {
    where['$readings.readingLists.read$'] = true
  } else if (req.query.read === 'false') {
    where['$readings.readingLists.read$'] = false
  }
  const user = await User.findByPk(id, {
    attributes: ['name', 'username'],
    where,
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
        include: [
          {
            model: ReadingList,
            attributes: ['read', 'id'],
          },
        ],
      },
    ],
  });
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
});

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