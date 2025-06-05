class Schedule {
    private scheduleItems: { id: number; title: string; time: string }[] = [];
    private nextId: number = 1;

    addScheduleItem(title: string, time: string): void {
        this.scheduleItems.push({ id: this.nextId++, title, time });
    }

    removeScheduleItem(id: number): void {
        this.scheduleItems = this.scheduleItems.filter(item => item.id !== id);
    }

    updateScheduleItem(id: number, title: string, time: string): void {
        const item = this.scheduleItems.find(item => item.id === id);
        if (item) {
            item.title = title;
            item.time = time;
        }
    }

    getScheduleItems(): { id: number; title: string; time: string }[] {
        return this.scheduleItems;
    }
}

export default Schedule;