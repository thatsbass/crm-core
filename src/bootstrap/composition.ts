import { ClientController } from "@modules/clients/client.controller";
import { LogController } from "@modules/logs/log.controller";
import {
  defaultServicesConfigPath,
  loadServiceContainer,
} from "@bootstrap/container";

const container = loadServiceContainer(defaultServicesConfigPath());

export const clientController = container.get<ClientController>("clientController");
export const logController = container.get<LogController>("logController");
