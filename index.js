const express = require('express')
const app = express()
require('express-async-errors')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/readinglists')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListRouter)


app.use((error, req, res, next) => {
  console.error(error)

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const errors = error.errors.map(err => ({
      message: err.message,
      value: err.value,
      field: err.path
    }));

    return res.status(400).json({
      error: "Validation error",
      details: errors
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  return res.status(500).json({ error: 'something went wrong' })
});




const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()