import { NextFunction, Request, Response } from "express";
import { LoggerService } from "@modules/logs/log.service";

export class LogController {

    constructor(private readonly logService: LoggerService) {}
    
    async getAllLogs(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const logs = await this.logService.getAllLogs();
            res.status(200).json(logs);
        } catch (error) {
            next(error);
        }
    }

    async findLogByPhone(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const { phone } = req.params;
            const log = await this.logService.findLogByPhone(phone);
            res.status(200).json(log);
        } catch (error) {
            next(error);
        }
    }

}