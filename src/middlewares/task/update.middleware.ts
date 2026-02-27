import { Request, Response, NextFunction } from "express";
import { validateDateField, validateEnumField, validateIdParam, validateStringField } from "@/utils/validators";
import { TaskPriority, TaskStatus } from "@/types/task.types";

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
        const title = validateStringField("title", req, res, "body");
        if (!title) return;
        req.body.title = title;
    }

    if (req.body.description !== undefined) {
        const description = validateStringField("description", req, res, "body");
        if (!description) return;
        req.body.description = description;
    }

    if (req.body.priority !== undefined) {
        const priority = validateEnumField("priority", TaskPriority, req, res, "body");
        if (!priority) return;
        req.body.priority = priority;
    }

    if (req.body.status !== undefined) {
        const status = validateEnumField("status", TaskStatus, req, res, "body");
        if (!status) return;
        req.body.status = status;
    }

    if (req.body.dueDate !== undefined) {
        const dueDate = validateDateField("dueDate", req, res);
        if (!dueDate) return;
        req.body.dueDate = dueDate;
    }

    next();
};