import { InactiveClientError } from "@shared/errors/inactive-client.error";
import { NotFoundError } from "@shared/errors/not-found.error";
import { CLIENT_MESSAGE } from "@modules/clients/client.constant";
import { LOG_MESSAGE } from "@modules/logs/log.constant";
import { LoggerService } from "@modules/logs/log.service";
import { LogStatus } from "@modules/logs/log.model";
import { ClientModel } from "@modules/clients/client.model";
import { IClient } from "@modules/clients/client.types";
import { ClientListQuery, ClientPayload } from "@modules/clients/client.types";
import { UserModel } from "@modules/users/user.model";
import mongoose, { FilterQuery, Types } from "mongoose";

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
  async createClient(payload: ClientPayload, actorUserId?: string): Promise<IClient> {
    const client = await ClientModel.create({ ...payload, userId: new Types.ObjectId(payload.userId) });
    await this.logService.createLog({
      clientId: client._id,
      userId: actorUserId ? new Types.ObjectId(actorUserId) : undefined,
      phone: client.phone,
      message: LOG_MESSAGE.CLIENT_CREATED,
      status: LogStatus.SUCCESS,
    });
    return client;
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
      const matchingUsers = await UserModel.find({
        $or: [{ name: search }, { email: search }],
      }).select("_id").exec();
      filter.$or = [
        { phone: search },
        { userId: { $in: matchingUsers.map((user) => user._id) } },
      ];
    }

    const skip = (query.page - 1) * query.limit;
    const [data, total] = await Promise.all([
      ClientModel.find(filter).populate("userId", "name email role isActive")
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
    const client = await ClientModel.findById(id)
      .populate("userId", "name email role isActive")
      .exec();
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
  async findClientByIdentifier(identifier: string, actorUserId?: string): Promise<IClient> {
    if (mongoose.isValidObjectId(identifier)) {
      return this.findClientById(identifier);
    }

    return this.findClientByPhone(identifier, actorUserId);
  }

  /**
   * Updates a client.
   *
   * @param id - MongoDB client identifier.
   * @param payload - Validated fields to update.
   * @returns The updated client.
   * @throws NotFoundError when no client matches the identifier.
   */
  async updateClient(id: string, payload: Partial<ClientPayload>, actorUserId?: string): Promise<IClient> {
    const client = await ClientModel.findByIdAndUpdate(
      id,
      { ...payload, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).exec();
    if (!client) {
      throw new NotFoundError("Client introuvable.");
    }
    await this.logService.createLog({
      clientId: client._id,
      userId: actorUserId ? new Types.ObjectId(actorUserId) : undefined,
      phone: client.phone,
      message: LOG_MESSAGE.CLIENT_UPDATED,
      status: LogStatus.SUCCESS,
    });
    return client;
  }

  /**
   * Soft-deletes a client by marking it inactive.
   *
   * @param id - MongoDB client identifier.
   * @throws NotFoundError when no client matches the identifier.
   */
  async deleteClient(id: string, actorUserId?: string): Promise<void> {
    const client = await ClientModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true },
    ).exec();
    if (!client) {
      throw new NotFoundError("Client introuvable.");
    }
    await this.logService.createLog({
      clientId: client._id,
      userId: actorUserId ? new Types.ObjectId(actorUserId) : undefined,
      phone: client.phone,
      message: LOG_MESSAGE.CLIENT_DEACTIVATED,
      status: LogStatus.SUCCESS,
    });
  }

  /**
   * Finds an active client by phone number and records the lookup.
   *
   * @param phone - Client phone number.
   * @returns The matching active client.
   * @throws NotFoundError when no client matches the phone number.
   * @throws InactiveClientError when the client is inactive.
   */
  async findClientByPhone(phone: string, actorUserId?: string): Promise<IClient> {
    const client = await ClientModel.findOne({ phone }).exec();

    if (!client) {
      await this.logService.createLog({
        userId: actorUserId ? new Types.ObjectId(actorUserId) : undefined,
        phone,
        message: CLIENT_MESSAGE.NOT_FOUND,
        status: LogStatus.NOT_FOUND,
      });
      throw new NotFoundError(CLIENT_MESSAGE.NOT_FOUND);
    }
    if (!client.isActive) {
      await this.logService.createLog({
        clientId: client._id,
        userId: actorUserId ? new Types.ObjectId(actorUserId) : undefined,
        phone,
        message: CLIENT_MESSAGE.INACTIVE,
        status: LogStatus.INACTIVE,
      });
      throw new InactiveClientError(CLIENT_MESSAGE.INACTIVE);
    }

    await this.logService.createLog({
      clientId: client._id,
      userId: actorUserId ? new Types.ObjectId(actorUserId) : undefined,
      phone,
      message: CLIENT_MESSAGE.FOUND,
      status: LogStatus.SUCCESS,
    });
    return client;
  }
}