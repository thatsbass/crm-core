export class InactiveClientError extends Error{
  constructor (message : string = "Client is inactive") {
    super(message)
    this.name = "InactiveClientError"
  }
}