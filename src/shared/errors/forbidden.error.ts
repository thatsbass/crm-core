export class ForbiddenError extends Error {
  /**
   * Creates an authorization error.
   *
   * @param message - Error message returned to the client.
   */
  constructor(message = "Accès interdit.") {
    super(message);
    this.name = "ForbiddenError";
  }
}
