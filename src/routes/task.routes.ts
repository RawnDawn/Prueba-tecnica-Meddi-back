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

// Filter
// Use - /priority?priority=high
// router.get("/priority",
//     validateTaskPriorityQuery,
//     validatePaginationQuery,
//     TaskController.getTasksByPriority
// );

// Use - /status?status=done
// router.get("/status",
//     validateTaskStatusQuery,
//     validatePaginationQuery,
//     TaskController.getTasksByStatus
// );

// Use - /search?title=lorem
// router.get("/search",
//     validateTitleQuery,
//     validatePaginationQuery,
//     TaskController.getTasksByTitle
// );

// Crud
router.get("/",
    validatePaginationQuery,
    validateTaskPriorityQuery,
    validateTaskStatusQuery,
    validateTitleQuery,
    TaskController.getAllTasks
);

router.post("/",
    validateTaskCreation,
    TaskController.createTask
);

router.get("/count/priority",
    TaskController.getTaskCountByPriority
);

router.get("/count/status",
    TaskController.getTaskCountByStatus
);

router.get("/count/created/days",
    TaskController.getTopCreatedDays
);

router.get("/count/completed/days",
    TaskController.getTopCompletedDays
);

router.put("/:id/done",
    validateTaskIdParam,
    TaskController.markTaskAsDone
);

router.put("/:id/pending",
    validateTaskIdParam,
    TaskController.markTaskAsPending
);

router.put("/:id",
    validateTaskIdParam,
    validateTaskUpdate,
    TaskController.updateTask
);

router.delete("/:id",
    validateTaskIdParam,
    TaskController.deleteTask
);

router.get("/:id",
    validateTaskIdParam,
    TaskController.getTaskById
);


export default router;