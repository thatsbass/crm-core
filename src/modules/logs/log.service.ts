
import { NotFoundError } from "@shared/errors/not-found.error";
import { ILog } from "@modules/logs/log.types";
import { LogModel } from "@modules/logs/log.model";
import { Types } from "mongoose";


export class LoggerService {
    /**
     * Returns all activity logs with their related users and clients.
     *
     * @returns The activity logs.
     */
    async getAllLogs(): Promise<ILog[]> {
        return LogModel.find()
            .populate("clientId", "phone address")
            .populate("userId", "name email role")
            .sort({ timestamp: -1 })
            .exec();
    }

    /**
     * Finds the latest log for a phone number.
     *
     * @param phone - Client phone number.
     * @returns The latest matching log.
     * @throws NotFoundError when no log matches the phone number.
     */
    async findLogByPhone(phone: string): Promise<ILog> {
        const log = await LogModel.findOne({ phone }).sort({ timestamp: -1 }).exec();
        if (!log) {
            throw new NotFoundError(`Pas de log pour ce numero ${phone}!`)
        }
        return log;
    }

    /**
     * Returns the activity history of a client.
     *
     * @param clientId - MongoDB client identifier.
     * @returns The client's activity logs.
     */
    async getLogsByClientId(clientId: string): Promise<ILog[]> {
        return LogModel.find({ clientId: new Types.ObjectId(clientId) })
            .populate("userId", "name email role")
            .sort({ timestamp: -1 })
            .exec();
    }

    /**
     * Persists an activity log.
     *
     * @param data - Activity details and optional entity associations.
     * @returns The persisted activity log.
     */
    async createLog(data: Partial<ILog>): Promise<ILog> {
        return new LogModel(data).save();
    }
}