import dotenv from "dotenv";
dotenv.config();

export const config = {
  MONGO_DB_CONN: process.env.MONGO_DB_CONN as string,
};

export const MONGO_DB_CONN = process.env.MONGO_DB_CONN;
if (!MONGO_DB_CONN) {
  console.error("NO MONGO CONNECTION STRING ");
  process.exit(1);
}
