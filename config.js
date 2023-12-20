require("dotenv").config();

const { HOST, PORT, DATABASE, DB_USER, DB_PASSWORD } = process.env;
module.exports = {
  host: HOST,
  port: PORT,
  database: DATABASE,
  user: DB_USER,
  password: DB_PASSWORD,
};
