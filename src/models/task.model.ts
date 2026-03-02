import { TaskPriority, TaskStatus } from "@/types/task.types";
import { Schema, Document, model } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: Date;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
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
        },
        completedAt: {
            type: Date,
            required: false,
            index: true
        }
    },
    {
        timestamps: true
    }
)

// Triggers
/**
 * Set completedAt when task is marked as done/pending
 */
taskSchema.pre("save", function (next) {
    if (this.isModified("status")) {
        if (this.status === TaskStatus.DONE) {
            this.completedAt = new Date()
        } else {
            this.completedAt = null
        }
    }
})

/**
 * Set completedAt when task is marked as done/pending
 */
taskSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate() as any;

    if (update.status === TaskStatus.DONE) {
        update.completedAt = new Date();
    } else if (update.status) {
        update.completedAt = null;
    }
});

// Indexes
// Filter by prio and state
taskSchema.index({ priority: 1, status: 1 });

// Ranking by creation date
taskSchema.index({ createdAt: -1 })

// Raking by task done
taskSchema.index({ status: 1, updatedAt: -1 });

// Seach by title
taskSchema.index({ title: "text" });

// Ranking by completed date
taskSchema.index({ completedAt: -1 });

export const Task = model<ITask>("Task", taskSchema, "taskAngel");