import * as TaskController from "@/controllers/task.controller";
import {
    validateTaskPriorityQuery,
    validateTaskStatusQuery,
    validateTitleQuery,
    validatePaginationQuery
} from "@/middlewares/task/query.middleware";
import { validateTaskIdParam } from "@/middlewares/task/param.middleware";
import { validateTaskCreation } from "@/middlewares/task/creation.middleware"
import { validateTaskUpdate } from "@/middlewares/task/update.middleware"
import { Router } from "express";

const router = Router();

// CRUD 
router.get("/",
    validatePaginationQuery,
    TaskController.getAllTasks);

router.get("/:id",
    validateTaskIdParam,
    TaskController.getTaskById);

router.post("/",
    validateTaskCreation,
    TaskController.createTask);

router.put("/:id",
    validateTaskIdParam,
    validateTaskUpdate, TaskController.updateTask);

router.delete("/:id",
    validateTaskIdParam,
    TaskController.deleteTask);

// Filters

// Use - /priority?priority=high
router.get("/priority",
    validateTaskPriorityQuery,
    validatePaginationQuery,
    TaskController.getTasksByPriority
)

// Use - /status?status=done
router.get("/status",
    validateTaskStatusQuery,
    validatePaginationQuery,
    TaskController.getTasksByStatus
)

// Use - /search?title=lorem
router.get("/search",
    validateTitleQuery,
    validatePaginationQuery,
    TaskController.getTasksByTitle
)

export default router;