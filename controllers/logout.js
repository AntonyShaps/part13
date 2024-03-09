const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Sequelize } = sequelize;
const { Session } = require('../models')

const { Blog, User } = require('../models')

const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Session, User } = require('../models')

const authenticate = async (req, res, next) => {

  if (!req.token) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }

  const session = await Session.findOne({ where: { token: req.token } })
  if (!session) {
    return res.status(401).json({ error: 'Session invalid' })
  }

  const user = await User.findByPk(session.userId);
  if (!user || user.is_disabled) {
    return res.status(401).json({ error: 'Account disabled or user not found' })
  }


  req.user = user
  next()
}


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

router.delete('/api/logout', tokenExtractor,authenticate, async (req, res) => {
  await Session.destroy({ where: { token: req.token } });
  res.status(204).end();
});



module.exports = router