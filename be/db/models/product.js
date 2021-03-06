module.exports = (sequelize, type) => {
  return sequelize.define("product", {
    key: { type: type.STRING, allowNull: false },
    description: { type: type.STRING, allowNull: false },
    quantity: { type: type.INTEGER, allowNull: false },
    pickedQuantity: { type: type.INTEGER, defaultValue: 0 },
    sale: { type: type.INTEGER, allowNull: false },
    warehouse: { type: type.STRING, allowNull: false },
    index: { type: type.INTEGER, allowNull: false },
    shippedQuantity: { type: type.INTEGER, defaultValue: 0 }
  });
};
