import { TaskPriority, TaskStatus } from "@/types/task.types";
import { Schema, Document, model } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            requried: true,
            trim: true
        },
        description: {
            type: String,
            required: false,
            trim: true
        },
        priority: {
            type: String,
            required: true,
            enum: Object.values(TaskPriority),
            index: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(TaskStatus),
            default: TaskStatus.PENDING,
            index: true
        },
        dueDate: {
            type: Date,
            required: false,
            index: true
        }
    },
    {
        timestamps: true
    }
)

// Indexes

// Filter by prio and state
taskSchema.index({ priority: 1, status: 1 });

// Ranking by creation date
taskSchema.index({ createcAt: -1 })

// Raking by task done
taskSchema.index({ status: 1, updatedAt: -1 });

// Seach by title
taskSchema.index({ title: "text" });

export const Task = model<ITask>("Task", taskSchema, "tasks");