export class UnauthorizedError extends Error {
  /**
   * Creates an authentication error.
   *
   * @param message - Error message returned to the client.
   */
  constructor(message = "Authentification requise.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
