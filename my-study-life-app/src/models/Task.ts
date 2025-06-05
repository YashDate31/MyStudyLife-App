export class Task {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;

    constructor(id: number, title: string, description: string, dueDate: Date) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.completed = false;
    }
}