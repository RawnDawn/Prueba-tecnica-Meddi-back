import { TaskPriority, TaskStatus } from "@/types/task.types";
import { validateDateField, validateEnumField, validateStringField } from "@/utils/validators";
import { NextFunction, Request, Response } from "express";

/**
 * Validate the entire request of a task creation
 * @param req request
 * @param res response 
 * @param next to continue
 */
export const validateTaskCreation = (req: Request, res: Response, next: NextFunction) => {
    const title = validateStringField("title", req, res, "body");
    if (!title) return;

    const description = validateStringField("description", req, res, "body");
    if (!description) return;

    const priority = validateEnumField("priority", TaskPriority, req, res, "body");
    if (!priority) return;

    const status = validateEnumField("status", TaskStatus, req, res, "body");
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