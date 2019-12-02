module.exports = (sequelize, type) => {
    return sequelize.define('user', {
      username: { type: type.STRING, primaryKey: true, allowNull: false, unique: true },
      password: { type: type.STRING, allowNull: false }
    })
}
  