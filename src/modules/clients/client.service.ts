import { InactiveClientError } from "@shared/errors/inactive-client.error";
import { NotFoundError } from "@shared/errors/not-found.error";
import { MESSAGE } from "@shared/helpers/constant";
import { LoggerService } from "@modules/logs/log.service";
import { LogStatus } from "@modules/logs/log.model";
import { ClientModel } from "@modules/clients/client.model";
import { IClient } from "@modules/clients/client.types";

export class ClientService {
  constructor (private readonly logService: LoggerService) {}
  /**
   * Finds a client by phone number.
   * @param phone - The phone number of the client to find.
   * @returns A promise that resolves to the found client.
   * @throws NotFoundError if the client is not found.
   * @throws InactiveClientError if the client is inactive.
   */
   async  findClientByPhone(phone: string): Promise<IClient> {
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