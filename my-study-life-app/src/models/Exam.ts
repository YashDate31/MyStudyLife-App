export class Exam {
    subject: string;
    date: Date;
    location: string;

    constructor(subject: string, date: Date, location: string) {
        this.subject = subject;
        this.date = date;
        this.location = location;
    }
}