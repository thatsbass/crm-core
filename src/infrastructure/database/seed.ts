import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ENV } from "@config/env";
import { ClientModel } from "@modules/clients/client.model";
import { LogModel } from "@modules/logs/log.model";
import { UserModel } from "@modules/users/user.model";
import { UserRole } from "@modules/users/user.types";

const clients = [
  {
    name: "Mariam Diongue",
    phone: "770092345",
    email: "mariam.dion@example.com",
    address: "Cite Gadaye",
    isActive: true,
  },
  {
    name: "Bassirou Diaw",
    phone: "786396743",
    email: "thatsbass@example.com",
    address: "Cite Gadaye",
    isActive: false,
  },
  {
    name: "Fatou Mbengue",
    phone: "770076515",
    email: "fatou.mbengue@example.com",
    address: "Dakar",
    isActive: true,
  },
];

/**
 * Replaces users, client profiles and logs with local seed data.
 *
 * @throws If the database connection or seeding operation fails.
 */
async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    await synchronizeIndexes();
    await clearSeedCollections();
    await createAdminUser();
    await createClientAccounts();
    console.log("Base de données initialisée avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

/**
 * Synchronizes MongoDB indexes with the current User and Client schemas.
 *
 * This removes obsolete indexes left by previous schema versions, such as
 * the former unique Client.email index.
 *
 * @returns A promise that resolves when both models are synchronized.
 */
async function synchronizeIndexes(): Promise<void> {
  await Promise.all([UserModel.syncIndexes(), ClientModel.syncIndexes()]);
}

/**
 * Removes data that is managed by the seed.
 *
 * @returns A promise that resolves when all collections are cleared.
 */
async function clearSeedCollections(): Promise<void> {
  await Promise.all([
    ClientModel.deleteMany({}),
    UserModel.deleteMany({}),
    LogModel.deleteMany({}),
  ]);
}

/**
 * Creates the administrator account used for local administration.
 *
 * @returns A promise that resolves when the administrator is created.
 */
async function createAdminUser(): Promise<void> {
  const password = await bcrypt.hash(ENV.SEED_ADMIN_PASSWORD, 12);
  await UserModel.create({
    name: ENV.SEED_ADMIN_NAME,
    email: ENV.SEED_ADMIN_EMAIL,
    password,
    role: UserRole.ADMIN,
  });
}

/**
 * Creates client users and their associated CRM profiles.
 *
 * @returns A promise that resolves when all client data is created.
 */
async function createClientAccounts(): Promise<void> {
  const password = await bcrypt.hash(ENV.SEED_CLIENT_PASSWORD, 12);

  for (const client of clients) {
    const user = await UserModel.create({
      name: client.name,
      email: client.email,
      password,
      role: UserRole.CLIENT,
      isActive: client.isActive,
    });

    await ClientModel.create({
      userId: user._id,
      phone: client.phone,
      address: client.address,
      isActive: client.isActive,
    });
  }
}

void seedDatabase();