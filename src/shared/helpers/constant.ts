import { ENV } from "@config/env";

const MESSAGE = {
  DB_CONNECTED: "MongoDB connecté",
  DB_ERROR: "Erreur connexion MongoDB:",
  SERVER_STARTED: `Serveur démarré sur le port ${ENV.PORT}`,
  SERVER_ERROR: "Erreur serveur:",
  INTERNAL_ERROR: "Erreur interne du serveur",
  INVALID_PHONE: "Le numéro de téléphone est invalide",
  CLIENT_FOUND: "Client trouvé avec succès",
  CLIENT_NOT_FOUND: "Aucun client trouvé avec ce numéro de téléphone",
  CLIENT_INACTIVE: "Le client est inactif",
  LOG_NOT_FOUND: "Aucun log trouvé avec ce numéro de téléphone",
};

const STATUS_CODE = {
  NOT_FOUND: 404,
  INACTIVE: 403,
  SUCCESS: 200,
  INTERNAL_ERROR: 500,
};

export { MESSAGE, STATUS_CODE };
