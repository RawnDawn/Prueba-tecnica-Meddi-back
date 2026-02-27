import { Request, Response } from "express";
import {
    createTask,
    findAllTasks,
    getTasksByPriority,
    getTasksByStatus,
    searchTasksByTitle,
    showTask,
    updateTask,
    deleteTask,
    markTaskAsDone
} from "@/services/task.service";
import { NotFoundError } from "@/errors/NotFoundError";
