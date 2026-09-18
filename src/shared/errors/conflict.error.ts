export class ConflictError extends Error {
  /**
   * Creates a resource conflict error.
   *
   * @param message - Error message returned to the client.
   */
  constructor(message = "La ressource existe déjà.") {
    super(message);
    this.name = "ConflictError";
  }
}
