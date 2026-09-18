import { ClientController } from "@modules/clients/client.controller";
import { LogController } from "@modules/logs/log.controller";
import { AuthController } from "@modules/auth/auth.controller";
import {
  defaultServicesConfigPath,
  loadServiceContainer,
} from "@bootstrap/container";

const container = loadServiceContainer(defaultServicesConfigPath());

export const clientController = container.get<ClientController>("clientController");
export const logController = container.get<LogController>("logController");
export const authController = container.get<AuthController>("authController");
