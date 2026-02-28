import { Request, Response, NextFunction } from "express";
import { validateDateField, validateEnumField, validateIdParam, validateStringField } from "@/utils/validators";
import { TaskPriority, TaskStatus } from "@/types/task.types";
import { DATE_IS_INVALID, DATE_IS_REQUIRED, DESCRIPTION_IS_REQUIRED, INVALID_PRIORITY, INVALID_STATUS, PRIORITY_IS_REQUIRED, STATUS_IS_REQUIRED, TITLE_IS_REQUIRED } from "@/errors/taskErrorCodes";

/**
 * Validate the request of a task update (partial)
 * @param req request
 * @param res response 
 * @param next to continue
 */
export const validateTaskUpdate = (req: Request, res: Response, next: NextFunction) => {
    const id = validateIdParam(req, res);
    if (!id) return;
    req.params.id = id;

    // Validate only present fields 
    if (req.body.title !== undefined) {
        const title = validateStringField("title", req, res, TITLE_IS_REQUIRED, "body");
        if (!title) return;
        req.body.title = title;
    }

    if (req.body.description !== undefined) {
        const description = validateStringField("description", req, res, DESCRIPTION_IS_REQUIRED, "body");
        if (!description) return;
        req.body.description = description;
    }

    if (req.body.priority !== undefined) {
        const priority = validateEnumField("priority", TaskPriority, req, res, PRIORITY_IS_REQUIRED, INVALID_PRIORITY, "body");
        if (!priority) return;
        req.body.priority = priority;
    }

    if (req.body.status !== undefined) {
        const status = validateEnumField("status", TaskStatus, req, res, STATUS_IS_REQUIRED, INVALID_STATUS, "body");
        if (!status) return;
        req.body.status = status;
    }

    if (req.body.dueDate !== undefined) {
        const dueDate = validateDateField("dueDate", req, res, DATE_IS_REQUIRED, DATE_IS_INVALID);
        if (!dueDate) return;
        req.body.dueDate = dueDate;
    }

    next();
};