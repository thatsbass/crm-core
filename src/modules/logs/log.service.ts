
import { NotFoundError } from "@shared/errors/not-found.error";
import { ILog } from "@modules/logs/log.types";
import { LogModel } from "@modules/logs/log.model";


export class LoggerService {
    async getAllLogs(): Promise<ILog[]> {
        return await LogModel.find().exec();
    }
    async findLogByPhone(phone: string): Promise<ILog> {
        const log = await LogModel.findOne({ phone }).exec();
        if (!log) {
            throw new NotFoundError(`Pas de log pour ce numero ${phone}!`)
        }
        return log;
    }
    async createLog(data: Partial<ILog>): Promise<ILog> {
        const newLog = new LogModel(data);
        return await newLog.save();
    }
}