import { NotFoundError } from "@/errors/NotFoundError";
import { Task } from "@/models/task.model";
import { ITask } from "@/models/task.model";
import { TaskPriority, TaskStatus } from "@/types/task.types";

/**
 * Get all task using pagination
 * @param page default 1
 * @param limit default 10
 * @returns paginated tasks
 */
export const findAllTasks = async (page = 1, limit = 10) => {
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
export const getTasksByPriority = async (
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
export const getTasksByStatus = async (
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
export const searchTasksByTitle = (
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
export const showTask = async (id: string) => {
    const task = await Task.findById(id);

    if (!task) {
        throw new NotFoundError("Task not found");
    }

    return task;
};

/**
 * Create a new task
 * @param data with task info
 * @return created task
 */
export const createTask = async (data: Partial<ITask>) => {
    return await Task.create(data);
}

/**
 * Update a task passin Partial info
 * @param data 
 * @returns updated task
 * @throws NotFoundError when task does not exists
 */
export const updateTask = async (data: Partial<ITask>) => {
    const task = await Task.findByIdAndUpdate(data._id, data, { new: true });

    if (!task) {
        throw new NotFoundError("Task not found");
    }

    return task;
}

/**
 * Delete a task
 * @param id task id
 * @returns deleted task
 * @throws NotFoundError when task does not exists
 */
export const deleteTask = async (id: string) => {
    const task = await Task.findById(id);

    if (!task) {
        throw new NotFoundError("Task not found");
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
export const markTaskAsDone = async (id: string) => {
    const task = await Task.findByIdAndUpdate(id, { status: TaskStatus.DONE }, { new: true });

    if (!task) {
        throw new NotFoundError("Task not found");
    }

    return task;
}