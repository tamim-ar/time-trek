const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load tasks
app.get('/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tasks');
        }
        let tasks = JSON.parse(data || '[]');

        // Filter tasks by period if specified
        const period = req.query.period;
        if (period) {
            const now = new Date();
            tasks = tasks.filter(task => {
                const createdTime = new Date(task.created);
                if (period === 'last24') {
                    return (now - createdTime) <= 24 * 60 * 60 * 1000; // Last 24 hours
                } else if (period === 'last3days') {
                    return (now - createdTime) <= 3 * 24 * 60 * 60 * 1000; // Last 3 days
                } else if (period === 'last7days') {
                    return (now - createdTime) <= 7 * 24 * 60 * 60 * 1000; // Last 7 days
                } else if (period === 'last30days') {
                    return (now - createdTime) <= 30 * 24 * 60 * 60 * 1000; // Last 30 days
                }
                return true;
            });
        }

        res.json(tasks);
    });
});

// Save tasks
app.post('/tasks', (req, res) => {
    fs.writeFile('tasks.json', JSON.stringify(req.body, null, 2), err => {
        if (err) {
            return res.status(500).send('Error saving tasks');
        }
        res.send('Tasks saved');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
