const Sequelize = require("sequelize");
require("dotenv").config();

const db = new Sequelize(
  process.env.BD_NAME,
  process.env.BD_USER,
  process.env.BD_PASSWORD ?? '',
  {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    define: {
      Timestamp: true,
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    operatorAliases: false,
  }
);

module.exports = db;
