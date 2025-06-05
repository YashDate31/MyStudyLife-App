export class DataService {
    private data: any;

    constructor() {
        this.data = {
            subjects: [],
            tasks: [],
            exams: []
        };
    }

    fetchData() {
        // Logic to fetch data from a data source (e.g., API, local storage)
        return this.data;
    }

    saveData(newData: any) {
        // Logic to save data to a data source
        this.data = { ...this.data, ...newData };
    }

    deleteData(type: string, id: number) {
        // Logic to delete data based on type and id
        if (type === 'subject') {
            this.data.subjects = this.data.subjects.filter((subject: any) => subject.id !== id);
        } else if (type === 'task') {
            this.data.tasks = this.data.tasks.filter((task: any) => task.id !== id);
        } else if (type === 'exam') {
            this.data.exams = this.data.exams.filter((exam: any) => exam.id !== id);
        }
    }
}