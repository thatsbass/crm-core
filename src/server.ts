import app from "@/app";
import { connectDB } from "@infrastructure/database/connection";
import { ENV } from "@config/env";
import { SYSTEM_MESSAGE } from "@shared/constants/message.constant";

/**
 * Connects to MongoDB and starts the HTTP server.
 *
 * @returns A promise that resolves after startup has been initiated.
 */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`${SYSTEM_MESSAGE.SERVER_STARTED} sur le port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error(SYSTEM_MESSAGE.SERVER_ERROR, error);
  }
};

startServer();
