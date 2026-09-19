import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ENV } from "@config/env";
import { UserModel } from "@modules/users/user.model";
import { UserRole } from "@modules/users/user.types";

/**
 * Creates or updates the configured production administrator.
 *
 * This command is idempotent and never deletes users, clients or logs.
 *
 * @throws If the database connection or administrator provisioning fails.
 */
async function provisionAdmin(): Promise<void> {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    await UserModel.syncIndexes();

    const password = await bcrypt.hash(ENV.SEED_ADMIN_PASSWORD, 12);
    const existingAdmin = await UserModel.findOne({
      email: ENV.SEED_ADMIN_EMAIL,
    }).exec();

    if (existingAdmin) {
      existingAdmin.name = ENV.SEED_ADMIN_NAME;
      existingAdmin.password = password;
      existingAdmin.role = UserRole.ADMIN;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log(`Administrateur mis à jour: ${ENV.SEED_ADMIN_EMAIL}`);
      return;
    }

    await UserModel.create({
      name: ENV.SEED_ADMIN_NAME,
      email: ENV.SEED_ADMIN_EMAIL,
      password,
      role: UserRole.ADMIN,
      isActive: true,
    });
    console.log(`Administrateur créé: ${ENV.SEED_ADMIN_EMAIL}`);
  } finally {
    await mongoose.disconnect();
  }
}

void provisionAdmin().catch((error: unknown) => {
  console.error(
    "Erreur lors de la création de l'administrateur:",
    error instanceof Error ? error.message : String(error),
  );
  process.exitCode = 1;
});
