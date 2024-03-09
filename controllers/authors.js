const { sequelize } = require('../util/db')
const { Sequelize } = sequelize
const { Blog } = require('../models')
const { Session, User } = require('../models')
const router = require('express').Router()


router.get('/', async (req, res, next) => {
    try {
        const authorStats = await Blog.findAll({
          attributes: [
            'author',
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'articles'],
            [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes'],
          ],
          group: ['author'],
          order: [[Sequelize.fn('SUM', Sequelize.col('likes')), 'DESC']],
          raw: true,
        });

        const response = authorStats.map(stat => ({
            author: stat.author,
            articles: Number(stat.articles),
            likes: Number(stat.likes)
        }));

        res.json(response)
    } catch (error) {
        console.error('Error fetching author stats:', error)
        next(error)
    }
});


module.exports = router