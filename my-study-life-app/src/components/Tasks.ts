import { Task } from '../models/Task';

export class Tasks {
    private taskList: Task[];

    constructor() {
        this.taskList = [];
    }

    addTask(task: Task): void {
        this.taskList.push(task);
    }

    completeTask(taskId: number): void {
        const task = this.taskList.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
        }
    }

    deleteTask(taskId: number): void {
        this.taskList = this.taskList.filter(t => t.id !== taskId);
    }

    getTasks(): Task[] {
        return this.taskList;
    }
}