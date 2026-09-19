import { NextFunction, Request, Response } from "express";
import {
  clientIdSchema,
  clientListQuerySchema,
  clientPayloadSchema,
  clientUpdateSchema,
} from "@modules/clients/client.schema";
import { ClientService } from "@modules/clients/client.service";
import type {} from "@shared/types/express";

export class ClientController {
  /**
   * Creates a controller with the client service dependency.
   *
   * @param clientService - Service responsible for client use cases.
   */
  constructor(private readonly clientService: ClientService) {}

  /**
   * Creates a client from the request payload.
   *
   * @param req - HTTP request containing the client payload.
   * @param res - HTTP response used to return the created client.
   * @param next - Express error handler callback.
   */
  async createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = clientPayloadSchema.parse(req.body);
      const client = await this.clientService.createClient(payload, req.user?.id);
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns a paginated collection of clients.
   *
   * @param req - HTTP request containing list query parameters.
   * @param res - HTTP response used to return the clients.
   * @param next - Express error handler callback.
   */
  async listClients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = clientListQuerySchema.parse(req.query);
      const result = await this.clientService.listClients(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns a client identified by its MongoDB ID or phone number.
   *
   * @param req - HTTP request containing the client identifier.
   * @param res - HTTP response used to return the client.
   * @param next - Express error handler callback.
   */
  async getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier } = req.params;
      const client = await this.clientService.findClientByIdentifier(identifier, req.user?.id);
      res.status(200).json(client);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a client with the fields provided in the request body.
   *
   * @param req - HTTP request containing the client ID and update payload.
   * @param res - HTTP response used to return the updated client.
   * @param next - Express error handler callback.
   */
  async updateClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = clientIdSchema.parse({ id: req.params.identifier });
      const payload = clientUpdateSchema.parse(req.body);
      const client = await this.clientService.updateClient(id, payload, req.user?.id);
      res.status(200).json(client);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Soft-deletes a client by marking it inactive.
   *
   * @param req - HTTP request containing the client ID.
   * @param res - HTTP response indicating successful deletion.
   * @param next - Express error handler callback.
   */
  async deleteClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = clientIdSchema.parse({ id: req.params.identifier });
      await this.clientService.deleteClient(id, req.user?.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

}
