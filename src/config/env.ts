import "dotenv/config";

const ENV = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase",
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "development-only-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME || "CRM Administrator",
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL || "admin@crm.local",
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD || "ChangeMeAdmin123!",
  SEED_CLIENT_PASSWORD: process.env.SEED_CLIENT_PASSWORD || "ChangeMe123!",
  ADMIN_SETUP_ENABLED: process.env.ADMIN_SETUP_ENABLED === "true",
  ADMIN_SETUP_KEY: process.env.ADMIN_SETUP_KEY || "",
};

export { ENV };
