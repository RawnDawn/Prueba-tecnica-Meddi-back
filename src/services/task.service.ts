import { NotFoundError } from "@/errors/NotFoundError";
import { BadRequestError } from "@/errors/BadRequestError";
import { Task } from "@/models/task.model";
import { ITask } from "@/models/task.model";
import { TaskPriority, TaskStatus } from "@/types/task.types";
import { TASK_NOT_FOUND, DUE_DATE_REQUIRED, DUE_DATE_MUST_BE_GREATER_THAN_NOW } from "@/errors/taskErrorCodes";

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
export const findAll = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    return await Task.find()
        .skip(skip)
        .limit(limit);
};

/**
 * Get tasks by priority using pagination
 * @param priority 
 * @param page default 1
 * @param limit default 10
 * @returns paginated tasks
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