module.exports = (sequelize, type) => {
    return sequelize.define('product', {
        key: {type: type.STRING, allowNull: false},
        quantity: { type: type.INTEGER, allowNull: false },
        sale: {type: type.INTEGER, allowNull: false},
        warehous: {type: type.STRING, allowNull: false}
    })
}
