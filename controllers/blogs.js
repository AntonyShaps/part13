const router = require('express').Router()
const { sequelize } = require('../util/db')
const { Sequelize } = sequelize;


const { Blog, User } = require('../models')

const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')


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

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  }


router.get('/', async (req, res, next) => {
  const search = req.query.search;
  let where = {};

  if (search) {
    where = {
      [Sequelize.Op.or]: [
        { title: { [Sequelize.Op.iLike]: `%${search}%` } },
        { author: { [Sequelize.Op.iLike]: `%${search}%` } }
      ]
    };
  }

  try {
    const blogs = await Blog.findAll({
      where,
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      order: [['likes', 'DESC']]
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    return res.json(blog)
  } catch(error) {
    next(error)
  }
})


router.put('/:id',blogFinder, async (req, res) => {
  try {
    if (req.blog) {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
    } catch(error) {
        next(error)
}
})

router.get('/:id',blogFinder, async (req, res) => {
  if (req.blog) {

    console.log(req.blog.toJSON())
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    if (!req.blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    if (req.blog.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'Only the creator can delete this blog' })
    }

    await req.blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error);
  }
});




module.exports = router