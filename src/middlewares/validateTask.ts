import { Request, Response, NextFunction } from "express";
import { validateDateField, validateEnumField, validateIdParam, validateStringField } from "@/utils/validators";
import { TaskPriority, TaskStatus } from "@/types/task.types";

export const validateTaskIdParam = (req: Request, res: Response, next: NextFunction) => {
    const id = validateIdParam(req, res);
    if (!id) return;
    req.params.id = id;

    next();
}

export const validateTaskPriorityQuery = (req: Request, res: Response, next: NextFunction) => {
    const priority = validateEnumField("priority", TaskPriority, req, res, "query");
    if (!priority) return;
    req.query.priority = priority;

    // Page validation
    let page = parseInt(req.query.page as string);
    if (isNaN(page) || page < 1) page = 1;
    req.query.page = page.toString();

    // Limit validation
    let limit = parseInt(req.query.limit as string);
    if (isNaN(limit) || limit < 1) limit = 10;
    req.query.limit = limit.toString();

    next();
}

export const validateTaskStatusQuery = (req: Request, res: Response, next: NextFunction) => {
    const status = validateEnumField("status", TaskStatus, req, res, "query");
    if (!status) return;
    req.query.status = status;

    // Page validation
    let page = parseInt(req.query.page as string);
    if (isNaN(page) || page < 1) page = 1;
    req.query.page = page.toString();

    // Limit validation
    let limit = parseInt(req.query.limit as string);
    if (isNaN(limit) || limit < 1) limit = 10;
    req.query.limit = limit.toString();

    next();
}

export const validateTitleQuery = (req: Request, res: Response, next: NextFunction) => {
    const title = validateStringField("title", req, res, "query");
    if (!title) return;
    req.query.title = title;

    // Page validation
    let page = parseInt(req.query.page as string);
    if (isNaN(page) || page < 1) page = 1;
    req.query.page = page.toString();

    // Limit validation
    let limit = parseInt(req.query.limit as string);
    if (isNaN(limit) || limit < 1) limit = 10;
    req.query.limit = limit.toString();

    next();
}

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