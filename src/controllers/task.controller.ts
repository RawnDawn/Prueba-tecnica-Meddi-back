import { Request, Response } from "express";
import * as TaskService from "@/services/task.service";
import { NotFoundError } from "@/errors/NotFoundError";
import { HttpStatus } from "@/utils/httpStatus";
import { TaskPriority, TaskStatus } from "@/types/task.types";
import { BadRequestError } from "@/errors/BadRequestError";

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const totalPages = await TaskService.getTotalPages(page, limit);

        const filters = {
            priority: req.query.priority as string,
            status: req.query.status as string,
            title: req.query.title as string,
            dueDate: req.query.dueDate as string
        };

        const tasks = await TaskService.findAll(page, limit, filters);

        res.status(HttpStatus.OK).json({
            data: tasks,
            status: HttpStatus.OK,
            page,
            limit,
            total: tasks.length,
            totalPages
        });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: error.message,
            status: HttpStatus.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * Manage request and response to get tasks by priority
 * @param req 
 * @param res 
 * @returns 
 * @deprecated
 */
export const getTasksByPriority = async (req: Request, res: Response) => {
    try {
        const priority = req.query.priority as TaskPriority;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const tasks = await TaskService.getByPriority(priority, page, limit);
        const totalPages = await TaskService.getTotalPages(page, limit);

        res.status(HttpStatus.OK)
            .json({
                data: tasks,
                status: HttpStatus.OK,
                page,
                limit,
                total: tasks.length,
                totalPages
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

/**
 * Manage request and response to get tasks by status
 * @param req 
 * @param res 
 * @returns 
 * @deprecated
 */
export const getTasksByStatus = async (req: Request, res: Response) => {
    try {
        const status = req.query.status as TaskStatus;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const tasks = await TaskService.getByStatus(status, page, limit);
        const totalPages = await TaskService.getTotalPages(page, limit);

        res.status(HttpStatus.OK)
            .json({
                data: tasks,
                status: HttpStatus.OK,
                page,
                limit,
                total: tasks.length,
                totalPages
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

/**
 * Manage request and response to get tasks by title
 * @param req 
 * @param res 
 * @returns 
 * @deprecated
 */
export const getTasksByTitle = async (req: Request, res: Response) => {
    try {
        const title = req.query.title as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const tasks = await TaskService.searchByTitle(title, page, limit);
        const totalPages = await TaskService.getTotalPages(page, limit);

        res.status(HttpStatus.OK)
            .json({
                data: tasks,
                status: HttpStatus.OK,
                page,
                limit,
                total: tasks.length,
                totalPages
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

export const getTaskCountByPriority = async (req: Request, res: Response) => {
    try {
        const taskCountByPriority = await TaskService.getTaskCountByPriority();
        res.status(HttpStatus.OK)
            .json({
                data: taskCountByPriority,
                status: HttpStatus.OK
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

export const getTaskCountByStatus = async (req: Request, res: Response) => {
    try {
        const taskCountByStatus = await TaskService.getTaskCountByStatus();
        res.status(HttpStatus.OK)
            .json({
                data: taskCountByStatus,
                status: HttpStatus.OK
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const task = await TaskService.show(id);

        res.status(200)
            .json({
                data: task,
                status: HttpStatus.OK
            })
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(HttpStatus.NOT_FOUND)
                .json({
                    error: error.message,
                    status: HttpStatus.NOT_FOUND
                });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

export const createTask = async (req: Request, res: Response) => {
    try {
        const task = await TaskService.create(req.body);
        res.status(HttpStatus.CREATED)
            .json({
                data: task,
                status: HttpStatus.CREATED
            });
    } catch (error: any) {
        if (error instanceof BadRequestError) {
            return res.status(HttpStatus.BAD_REQUEST)
                .json({
                    error: error.message,
                    status: HttpStatus.BAD_REQUEST
                })
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

export const updateTask = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const task = await TaskService.update(id, req.body);
        res.status(HttpStatus.OK)
            .json({
                data: task,
                status: HttpStatus.OK
            });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(HttpStatus.NOT_FOUND)
                .json({
                    error: error.message,
                    status: HttpStatus.NOT_FOUND
                });
        }

        if (error instanceof BadRequestError) {
            return res.status(HttpStatus.BAD_REQUEST)
                .json({
                    error: error.message,
                    status: HttpStatus.BAD_REQUEST
                })
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await TaskService.destroy(id);
        res.status(HttpStatus.NO_CONTENT)
            .json({
                status: HttpStatus.NO_CONTENT
            });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(HttpStatus.NOT_FOUND)
                .json({
                    error: error.message,
                    status: HttpStatus.NOT_FOUND
                });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

export const markTaskAsDone = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const task = await TaskService.markAsDone(id);
        res.status(HttpStatus.OK)
            .json({
                data: task,
                status: HttpStatus.OK
            });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(HttpStatus.NOT_FOUND)
                .json({
                    error: error.message,
                    message: HttpStatus.NOT_FOUND
                });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

export const markTaskAsPending = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const task = await TaskService.markAsPending(id);
        res.status(HttpStatus.OK)
            .json({
                data: task,
                status: HttpStatus.OK
            });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(HttpStatus.NOT_FOUND)
                .json({
                    error: error.message,
                    message: HttpStatus.NOT_FOUND
                });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

export const getTopCreatedDays = async (req: Request, res: Response) => {
    try {
        const topCreatedDays = await TaskService.getTopCreatedDays();
        res.status(HttpStatus.OK)
            .json({
                data: topCreatedDays,
                status: HttpStatus.OK
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}

export const getTopCompletedDays = async (req: Request, res: Response) => {
    try {
        const topCompletedDays = await TaskService.getTopCompletedDays();
        res.status(HttpStatus.OK)
            .json({
                data: topCompletedDays,
                status: HttpStatus.OK
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                error: error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR
            });
    }
}
