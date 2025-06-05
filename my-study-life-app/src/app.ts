import express from 'express';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import { Tasks } from './components/Tasks';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Initialize components
const dashboard = new Dashboard();
const schedule = new Schedule();
const tasks = new Tasks();

// Set up routes
app.get('/dashboard', (req, res) => {
    res.send(dashboard.render());
});

app.get('/schedule', (req, res) => {
    res.send(schedule.getScheduleItems());
});

app.get('/tasks', (req, res) => {
    res.send(tasks.getTasks());
});

// Start the application
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});