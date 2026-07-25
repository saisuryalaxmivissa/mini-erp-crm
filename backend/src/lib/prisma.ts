import "dotenv/config";
import { PrismaClient } from "../generated/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
console.log("User:", process.env.MYSQL_USER);
console.log("Password loaded:", !!process.env.MYSQL_PASSWORD);
const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: "mini_erp_crm",
  connectTimeout: 5000,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;