import { Request, Response, NextFunction } from "express";
import { validateDateField, validateEnumField, validateStringField } from "@/utils/validators";
import { TaskPriority, TaskStatus } from "@/types/task.types";

/**
 * Validate the entire request of a task creation
 * @param req request
 * @param res response 
 * @param next to continue
 */
export const validateTaskCreation = (req: Request, res: Response, next: NextFunction) => {
    const title = validateStringField("title", req, res);
    if (!title) return;

    const description = validateStringField("description", req, res);
    if (!description) return;

    const priority = validateEnumField("priority", TaskPriority, req, res);
    if (!priority) return;

    const status = validateEnumField("status", TaskStatus, req, res);
    if (!status) return;

    const dueDate = validateDateField("dueDate", req, res);
    if (!dueDate) return;

    req.body.title = title;
    req.body.description = description;
    req.body.priority = priority;
    req.body.status = status;
    req.body.dueDate = dueDate;

    next();
}

/**
 * Validate the request of a task update (partial)
 * @param req request
 * @param res response 
 * @param next to continue
 */
export const validateTaskUpdate = (req: Request, res: Response, next: NextFunction) => {
    // Validate only present fields 

    if (req.body.title !== undefined) {
        const title = validateStringField("title", req, res);
        if (!title) return;
        req.body.title = title;
    }

    if (req.body.description !== undefined) {
        const description = validateStringField("description", req, res);
        if (!description) return;
        req.body.description = description;
    }

    if (req.body.priority !== undefined) {
        const priority = validateEnumField("priority", TaskPriority, req, res);
        if (!priority) return;
        req.body.priority = priority;
    }

    if (req.body.status !== undefined) {
        const status = validateEnumField("status", TaskStatus, req, res);
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