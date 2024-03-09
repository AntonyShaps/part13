const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { ReadingList } = require('../models')



const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    req.token = token; // Store token in request for later use
    next();
  } else {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
};

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  const rl = await ReadingList.create({ blogId, userId })
  res.json(rl)
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const { id } = req.params;
  const rl = await ReadingList.findByPk(id);

  if (rl && req.body.update) {
    const updaterl = await rl.update({
      read: req.body.read,
    });
    res.json(updaterl)
  } else if (rl) {
    res.status(400).json({ error: 'no value' })
  } else {
    res.status(404).end()
  }
})


module.exports = router