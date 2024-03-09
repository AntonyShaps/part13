const Blog = require('./blog')
const User = require('./user')
const ReadingList= require('./reading_list')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, ad: 'readingsUser' })

User.hasMany(ReadingList)
ReadingList.belongsTo(User)
Blog.hasMany(ReadingList)
ReadingList.belongsTo(Blog)

module.exports = {
  Blog, User
}