import { NextFunction, Request, Response } from "express";
import { LoggerService } from "@modules/logs/log.service";

export class LogController {

    /**
     * Creates a log controller.
     *
     * @param logService - Service responsible for activity logs.
     */
    constructor(private readonly logService: LoggerService) {}

    /**
     * Returns all activity logs.
     *
     * @param req - HTTP request.
     * @param res - HTTP response.
     * @param next - Express error handler callback.
     */
    async getAllLogs(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const logs = await this.logService.getAllLogs();
            res.status(200).json(logs);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Returns the latest log for a client phone number.
     *
     * @param req - HTTP request containing the phone number.
     * @param res - HTTP response.
     * @param next - Express error handler callback.
     */
    async findLogByPhone(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const { phone } = req.params;
            const log = await this.logService.findLogByPhone(phone);
            res.status(200).json(log);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Returns the activity history for a client.
     *
     * @param req - HTTP request containing the client identifier.
     * @param res - HTTP response.
     * @param next - Express error handler callback.
     */
    async getLogsByClientId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const logs = await this.logService.getLogsByClientId(req.params.clientId);
            res.status(200).json(logs);
        } catch (error) {
            next(error);
        }
    }

}