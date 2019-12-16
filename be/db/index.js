const Sequelize = require('sequelize')
const UserModel = require('./models/user')
const PickingWaveModel = require('./models/pickingWave')
const ProductModel = require('./models/product')

const sequelize = new Sequelize('server', 'admin', 'sqladmin', {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    storage: 'db/database.sqlite'
})

const User = UserModel(sequelize, Sequelize)
const Product = ProductModel(sequelize, Sequelize)
const PickingWave = PickingWaveModel(sequelize, Sequelize)
PickingWave.hasMany(Product)
Product.belongsTo(PickingWave)

sequelize
.authenticate()
.then(() => {
    console.log('SQLite connection has been established successfully.');
})
.catch(error => {
    console.error('Unable to connect to the database:', error);
})

sequelize
.sync({ force: true })
.then(() => {
    console.log(`Database & tables created!`)
    User.bulkCreate([
        { username: 'amadeu', password: 'password123' },
        { username: 'tpcred', password: '12345678'}
    ])
})


module.exports = {
  User,
  PickingWave,
  Product,
}
