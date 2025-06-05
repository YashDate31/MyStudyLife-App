export interface Subject {
    name: string;
    code: string;
}

export interface Task {
    title: string;
    description: string;
    dueDate: Date;
}

export interface Exam {
    subject: Subject;
    date: Date;
    location: string;
}