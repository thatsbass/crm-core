import { ClientController } from "../modules/clients/client.controller";
import { LogController } from "../modules/logs/log.controller";
import {
  defaultServicesConfigPath,
  loadServiceContainer,
} from "./service.container";

const container = loadServiceContainer(defaultServicesConfigPath());

const clientController = container.get<ClientController>("ClientController");
const logController = container.get<LogController>("LogController");

export { clientController, logController };