module.exports = (sequelize, type) => {
  return sequelize.define("pickingWave", {
    state: { type: type.ENUM(["OPEN", "FINISHED"]), defaultValue: "OPEN" }
  });
};
