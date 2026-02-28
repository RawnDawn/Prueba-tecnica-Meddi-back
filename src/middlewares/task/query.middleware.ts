import { Request, Response, NextFunction } from "express";
import { validateEnumField, validateStringField } from "@/utils/validators";
import { TaskPriority, TaskStatus } from "@/types/task.types";
import { INVALID_PRIORITY, INVALID_STATUS, PRIORITY_IS_REQUIRED, STATUS_IS_REQUIRED, TITLE_IS_REQUIRED } from "@/errors/taskErrorCodes";

/**
 * Validate task priority query filter
 * @param req 
 * @param res 
 * @param next
 * @returns 
 */
export const validateTaskPriorityQuery = (req: Request, res: Response, next: NextFunction) => {
    const priority = validateEnumField("priority", TaskPriority, req, res, PRIORITY_IS_REQUIRED, INVALID_PRIORITY, "query");
    if (!priority) return;
    req.query.priority = priority;

    next();
}

/**
 * Validate task status query filter
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const validateTaskStatusQuery = (req: Request, res: Response, next: NextFunction) => {
    const status = validateEnumField("status", TaskStatus, req, res, STATUS_IS_REQUIRED, INVALID_STATUS, "query");
    if (!status) return;
    req.query.status = status;

    next();
}

/**
 * Validate task title query filter
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const validateTitleQuery = (req: Request, res: Response, next: NextFunction) => {
    const title = validateStringField("title", req, res, TITLE_IS_REQUIRED, "query");
    if (!title) return;
    req.query.title = title;

    next();
}

/**
 * Validate pagination data
 * @param req 
 * @param _res 
 * @param next 
 */
export const validatePaginationQuery = (req: Request, _res: Response, next: NextFunction) => {
    let page = parseInt(req.query.page as string);
    if (isNaN(page) || page < 1) page = 1;
    req.query.page = page.toString();

    let limit = parseInt(req.query.limit as string);
    if (isNaN(limit) || limit < 1) limit = 10;
    req.query.limit = limit.toString();

    next();
};