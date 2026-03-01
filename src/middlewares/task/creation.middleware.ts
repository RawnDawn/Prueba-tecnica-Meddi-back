import { DATE_IS_INVALID, DATE_IS_REQUIRED, DESCRIPTION_IS_REQUIRED, INVALID_PRIORITY, PRIORITY_IS_REQUIRED, TITLE_IS_REQUIRED } from "@/errors/taskErrorCodes";
import { TaskPriority } from "@/types/task.types";
import { validateDateField, validateEnumField, validateStringField } from "@/utils/validators";
import { NextFunction, Request, Response } from "express";

/**
 * Validate the entire request of a task creation
 * @param req request
 * @param res response 
 * @param next to continue
 */
export const validateTaskCreation = (req: Request, res: Response, next: NextFunction) => {
    const title = validateStringField("title", req, res, TITLE_IS_REQUIRED, "body");
    if (!title) return;

    if (req.body.description !== undefined && req.body.description !== "") {
        const description = validateStringField("description", req, res, DESCRIPTION_IS_REQUIRED, "body");
        if (!description) return;
        req.body.description = description;
    }

    const priority = validateEnumField("priority", TaskPriority, req, res, PRIORITY_IS_REQUIRED, INVALID_PRIORITY, "body");
    if (!priority) return;

    // const status = validateEnumField("status", TaskStatus, req, res, "body");
    // if (!status) return;

    const dueDate = validateDateField("dueDate", req, res, DATE_IS_REQUIRED, DATE_IS_INVALID);
    if (!dueDate) return;

    req.body.title = title;
    req.body.priority = priority;
    // req.body.status = status;
    req.body.dueDate = dueDate;

    next();
}