import mongoose from "mongoose";
import { ENV } from "@config/env";
import { ClientModel } from "@modules/clients/client.model";
import { LogModel } from "@modules/logs/log.model";

const clients = [
    {name: "Mariam Diongue", phone: "773612264", email: "mariam.dion@example.com", address: "Cite gadaye", isActive: true,},
    {name: "Bassirou Diaw", phone: "786333750", email: "thatsbass@example.com", address: "Pikine", isActive: false,},
    {name: "Fatou Mbengue", phone: "771302004", email: "fatou.mbengue@example.com", address: "Dakar", isActive: true,},
];

/**
 * Replaces the client and log collections with the local seed data.
 *
 * @throws If the database connection or seeding operation fails.
 */
async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    await Promise.all([ClientModel.deleteMany({}), LogModel.deleteMany({})]);
    await ClientModel.insertMany(clients);
    console.log("Base de données initialisée avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();