import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const {
  DB_HOST = "127.0.0.1",
  DB_PORT = "3306",
  DB_NAME = "isi_alunos_livros_biblioteca",
  DB_USER = "root",
  DB_PASS = "",
  DB_DIALECT = "mariadb"
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: DB_DIALECT as any, // 'mariadb'
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 20000,
    idle: 10000
  }
});

// teste de conexão (chamado pelo index.ts)
export async function testConnection() {
  await sequelize.authenticate();
}
