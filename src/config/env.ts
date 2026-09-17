import "dotenv/config";

const ENV = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase",
  PORT: Number(process.env.PORT) || 3000,
};

export { ENV };
