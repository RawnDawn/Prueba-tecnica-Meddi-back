import { NotFoundError } from "@/errors/NotFoundError";
import { BadRequestError } from "@/errors/BadRequestError";
import { Task } from "@/models/task.model";
import { ITask } from "@/models/task.model";
import { TaskPriority, TaskStatus } from "@/types/task.types";
import { TASK_NOT_FOUND, DUE_DATE_REQUIRED, DUE_DATE_MUST_BE_GREATER_THAN_NOW } from "@/errors/taskErrorCodes";
import { daysMap } from "@/utils/mongoDaysMap";

interface TaskFilter {
    priority?: string
    status?: string
    title?: string
    dueDate?: string
}

/**
 * Get total pages for a pagination
 * @param page 
 * @param limit 
 * @returns 
 */
export const getTotalPages = async (page = 1, limit = 10) => {
    const totalTasks = await Task.countDocuments();
    return Math.ceil(totalTasks / limit);
}

/**
 * Get all task using pagination
 * @param page default 1
 * @param limit default 10
 * @returns paginated tasks
 */
export const findAll = async (page = 1, limit = 10, filters: TaskFilter = {}) => {
    const skip = (page - 1) * limit;

    const query: any = {};

    // add filter to query
    if (filters.priority) query.priority = filters.priority;
    if (filters.status) query.status = filters.status;
    if (filters.title) query.title = { $regex: filters.title, $options: 'i' }; // option to dont check mayus
    if (filters.dueDate) query.dueDate = filters.dueDate;

    return await Task.find(query)
        .skip(skip)
        .limit(limit);
};

/**
 * Get tasks by priority using pagination
 * @param priority 
 * @param page default 1
 * @param limit default 10
 * @returns paginated tasks
 * @deprecated 
 */
export const getByPriority = async (
    priority: TaskPriority,
    page = 1,
    limit = 10
) => {
    const skip = (page - 1) * limit;

    return Task.find({ priority })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

/**
 * Get tasks by status using pagination
 * @param status 
 * @param page default 1
 * @param limit default 10
 * @returns paginated tasks
 * @deprecated 
 */
export const getByStatus = async (
    status: TaskStatus,
    page = 1,
    limit = 10
) => {
    const skip = (page - 1) * limit;

    return Task.find({ status })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

/**
 * Search tasks by title using pagination
 * @param text 
 * @param page default 1
 * @param limit default 10
 * @returns paginated tasks
 * @deprecated 
 */
export const searchByTitle = (
    text: string,
    page = 1,
    limit = 10
) => {
    const skip = (page - 1) * limit;

    return Task.find({ $text: { $search: text } })
        .skip(skip)
        .limit(limit);
};

/**
 * Get a task by id
 * @param id task id
 * @returns referenced task
 * @throws NotFoundError when task does not exists
 */
export const show = async (id: string) => {
    const task = await Task.findById(id);

    if (!task) {
        throw new NotFoundError(TASK_NOT_FOUND);
    }

    return task;
};

/**
 * Get task count by priority
 * @returns task count by priority
 */
export const getTaskCountByPriority = async () => {
    const lowPrioTask = await Task.find({ priority: TaskPriority.LOW })
        .countDocuments();
    const mediumPrioTask = await Task.find({ priority: TaskPriority.MEDIUM })
        .countDocuments();
    const highPrioTask = await Task.find({ priority: TaskPriority.HIGH })
        .countDocuments();

    return {
        [TaskPriority.LOW]: lowPrioTask,
        [TaskPriority.MEDIUM]: mediumPrioTask,
        [TaskPriority.HIGH]: highPrioTask
    }
}

/**
 * Get task count by status
 * @returns task count by status
 */
export const getTaskCountByStatus = async () => {
    const pendingTask = await Task.find({ status: TaskStatus.PENDING })
        .countDocuments();
    const doneTask = await Task.find({ status: TaskStatus.DONE })
        .countDocuments();

    return {
        [TaskStatus.PENDING]: pendingTask,
        [TaskStatus.DONE]: doneTask
    }
}

/**
 * Create a new task
 * @param data with task info
 * @return created task
 */
export const create = async (data: Partial<ITask>) => {
    if (!data.dueDate) {
        throw new BadRequestError(DUE_DATE_REQUIRED);
    }

    const dueDate = new Date(data.dueDate);

    if (dueDate < new Date()) {
        throw new BadRequestError(DUE_DATE_MUST_BE_GREATER_THAN_NOW);
    }

    return await Task.create(data);
}

/**
 * Update a task passin Partial info
 * @param data 
 * @returns updated task
 * @throws NotFoundError when task does not exists
 */
export const update = async (id: string, data: Partial<ITask>) => {
    const task = await Task.findByIdAndUpdate(id, data, { new: true });

    // If due date is present, validate if is greater than now
    if (data.dueDate) {
        const dueDate = new Date(data.dueDate);

        if (dueDate < new Date()) {
            throw new BadRequestError(DUE_DATE_MUST_BE_GREATER_THAN_NOW);
        }
    }

    if (!task) {
        throw new NotFoundError(TASK_NOT_FOUND);
    }

    return task;
}

/**
 * Delete a task
 * @param id task id
 * @returns deleted task
 * @throws NotFoundError when task does not exists
 */
export const destroy = async (id: string) => {
    const task = await Task.findById(id);

    if (!task) {
        throw new NotFoundError(TASK_NOT_FOUND);
    }

    await task.deleteOne();
    return task;
};

/**
 * Mark a task as done 
 * @param id task id
 * @returns updated task
 * @throws NotFoundError when task does not exists
 */
export const markAsDone = async (id: string) => {
    const task = await Task.findByIdAndUpdate(id, { status: TaskStatus.DONE }, { new: true });

    if (!task) {
        throw new NotFoundError(TASK_NOT_FOUND);
    }

    return task;
}

/**
 * Mark a task as pending
 * @param id 
 * @returns 
 */
export const markAsPending = async (id: string) => {
    const task = await Task.findByIdAndUpdate(id, { status: TaskStatus.PENDING }, { new: true });

    if (!task) {
        throw new NotFoundError(TASK_NOT_FOUND);
    }

    return task;
}

/**
 * Get days with more created tasks
 * @returns 
 */
export async function getTopCreatedDays() {
    const result = await Task.aggregate([
        // Optimization
        { $match: { createdAt: { $exists: true } } }, // only get documents with createdAt
        // Get by index and only bring createdAt
        { $project: { createdAt: 1, _id: 0 } },
        {
            $group: {
                // Identifies day, converts into number
                _id: { $dayOfWeek: "$createdAt" },
                // For every task found, add 1 to the count
                total: { $sum: 1 }
            }
        },

        // Use sort first for optimization
        { $sort: { total: -1 } },
        { $limit: 3 }
    ])

    return result.map(d => ({
        day: daysMap[d._id],
        total: d.total
    }))
}

/**
 * Get days with more completed tasks
 * @returns 
 */
export async function getTopCompletedDays() {
    const result = await Task.aggregate([
        // Optimization
        { $match: { completedAt: { $ne: null } } },
        // Get by index and only bring completedAt
        { $project: { completedAt: 1, _id: 0 } },

        {
            $group: {
                _id: { $dayOfWeek: "$completedAt" },
                total: { $sum: 1 }
            }
        },
        { $sort: { total: -1 } },
        { $limit: 3 }
    ])

    return result.map(d => ({
        day: daysMap[d._id],
        total: d.total
    }))
}