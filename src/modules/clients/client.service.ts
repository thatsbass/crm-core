import { InactiveClientError } from "@shared/errors/inactive-client.error";
import { NotFoundError } from "@shared/errors/not-found.error";
import { MESSAGE } from "@shared/helpers/constant";
import { LoggerService } from "@modules/logs/log.service";
import { LogStatus } from "@modules/logs/log.model";
import { ClientModel } from "@modules/clients/client.model";
import { IClient } from "@modules/clients/client.types";
import { ClientListQuery, ClientPayload } from "@modules/clients/client.types";
import mongoose, { FilterQuery } from "mongoose";

export class ClientService {
  /**
   * Creates a service with the logger dependency.
   *
   * @param logService - Service used to record client lookup activity.
   */
  constructor(private readonly logService: LoggerService) {}

  /**
   * Creates a new client.
   *
   * @param payload - Validated client data.
   * @returns The persisted client.
   */
  async createClient(payload: ClientPayload): Promise<IClient> {
    return ClientModel.create(payload);
  }

  /**
   * Retrieves clients according to pagination, filtering and sorting options.
   *
   * @param query - Validated list options.
   * @returns The matching clients and pagination metadata.
   */
  async listClients(query: ClientListQuery): Promise<{
    data: IClient[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const filter: FilterQuery<IClient> = {};
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    } else {
      filter.isActive = true;
    }

    if (query.search) {
      const search = new RegExp(query.search, "i");
      filter.$or = [{ name: search }, { email: search }, { phone: search }];
    }

    const skip = (query.page - 1) * query.limit;
    const [data, total] = await Promise.all([
      ClientModel.find(filter)
        .sort({ [query.sortBy]: query.sortOrder })
        .skip(skip)
        .limit(query.limit)
        .exec(),
      ClientModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  /**
   * Finds a client by its MongoDB identifier.
   *
   * @param id - MongoDB client identifier.
   * @returns The matching client.
   * @throws NotFoundError when no client matches the identifier.
   */
  async findClientById(id: string): Promise<IClient> {
    const client = await ClientModel.findById(id).exec();
    if (!client) {
      throw new NotFoundError("Client introuvable.");
    }
    return client;
  }

  /**
   * Finds a client by MongoDB identifier or phone number.
   *
   * @param identifier - MongoDB identifier or client phone number.
   * @returns The matching active client.
   * @throws NotFoundError when no client matches the identifier.
   * @throws InactiveClientError when the client is inactive.
   */
  async findClientByIdentifier(identifier: string): Promise<IClient> {
    if (mongoose.isValidObjectId(identifier)) {
      return this.findClientById(identifier);
    }

    return this.findClientByPhone(identifier);
  }

  /**
   * Updates a client.
   *
   * @param id - MongoDB client identifier.
   * @param payload - Validated fields to update.
   * @returns The updated client.
   * @throws NotFoundError when no client matches the identifier.
   */
  async updateClient(id: string, payload: Partial<ClientPayload>): Promise<IClient> {
    const client = await ClientModel.findByIdAndUpdate(
      id,
      { ...payload, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).exec();
    if (!client) {
      throw new NotFoundError("Client introuvable.");
    }
    return client;
  }

  /**
   * Soft-deletes a client by marking it inactive.
   *
   * @param id - MongoDB client identifier.
   * @throws NotFoundError when no client matches the identifier.
   */
  async deleteClient(id: string): Promise<void> {
    const client = await ClientModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true },
    ).exec();
    if (!client) {
      throw new NotFoundError("Client introuvable.");
    }
  }

  /**
   * Finds an active client by phone number and records the lookup.
   *
   * @param phone - Client phone number.
   * @returns The matching active client.
   * @throws NotFoundError when no client matches the phone number.
   * @throws InactiveClientError when the client is inactive.
   */
  async findClientByPhone(phone: string): Promise<IClient> {
    const client = await ClientModel.findOne({ phone }).exec();

    if (!client) {
      await this.logService.createLog({ message: MESSAGE.CLIENT_NOT_FOUND, phone, status: LogStatus.NOT_FOUND });
      throw new NotFoundError(MESSAGE.CLIENT_NOT_FOUND);
    }
    if (!client.isActive) {
      await this.logService.createLog({ message: MESSAGE.CLIENT_INACTIVE, phone, status: LogStatus.INACTIVE });
      throw new InactiveClientError(MESSAGE.CLIENT_INACTIVE);
    }

    await this.logService.createLog({ message: MESSAGE.CLIENT_FOUND, phone, status: LogStatus.SUCCESS });
    return client;
  }
}