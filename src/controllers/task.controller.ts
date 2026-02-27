import { Request, Response } from "express";
import * as TaskService from "@/services/task.service";
import { NotFoundError } from "@/errors/NotFoundError";
import { HttpStatus } from "@/utils/httpStatus";
import { TaskPriority, TaskStatus } from "@/types/task.types";

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const tasks = await TaskService.findAll(page, limit);
        res.status(HttpStatus.OK)
            .json({
                data: tasks,
                status: HttpStatus.OK,
                page,
                limit,
                total: tasks.length
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
}

export const getTasksByPriority = async (req: Request, res: Response) => {
    try {
        const priority = req.params.priority;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const tasks = await TaskService.getByPriority(priority as TaskPriority, page, limit);
        res.status(HttpStatus.OK)
            .json({
                data: tasks,
                status: HttpStatus.OK,
                page,
                limit,
                total: tasks.length
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
}

export const getTasksByStatus = async (req: Request, res: Response) => {
    try {
        const status = req.params.status;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const tasks = await TaskService.getByStatus(status as TaskStatus, page, limit);
        res.status(HttpStatus.OK)
            .json({
                data: tasks,
                status: HttpStatus.OK,
                page,
                limit,
                total: tasks.length
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
}

export const getTasksByTitle = async (req: Request, res: Response) => {
    try {
        const title = req.query.title as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const tasks = await TaskService.searchByTitle(title, page, limit);
        res.status(HttpStatus.OK)
            .json({
                data: tasks,
                status: HttpStatus.OK,
                page,
                limit,
                total: tasks.length
            });
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
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
                .json({ error: error.message });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
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
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
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
                .json({ error: error.message });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        res.status(HttpStatus.NO_CONTENT)
            .json({
                status: HttpStatus.NO_CONTENT
            });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(HttpStatus.NOT_FOUND)
                .json({ error: error.message });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
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
                .json({ error: error.message });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
}