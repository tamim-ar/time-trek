let tasks = [];
let timer;
let currentTaskIndex = null;

window.onload = () => {
    loadTasks();
};

// Load tasks from server
function loadTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(data => {
            tasks = data;
            renderTasks();
        });
}

// Save tasks to server
function saveTasks() {
    fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tasks)
    });
}

function addTask() {
    const taskName = document.getElementById('task-name').value;
    if (taskName) {
        const task = {
            name: taskName,
            time: 0,
            status: "stopped",
            created: new Date().toISOString()
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        document.getElementById('task-name').value = ''; // Clear input field
    }
}

function toggleTimer(index) {
    const task = tasks[index];

    // Stop any currently running task
    if (currentTaskIndex !== null && currentTaskIndex !== index) {
        tasks[currentTaskIndex].status = "stopped";
        clearInterval(timer);
    }

    // Toggle current task's timer
    if (task.status === "running") {
        clearInterval(timer);
        task.status = "stopped";
        currentTaskIndex = null;
    } else {
        task.status = "running";
        currentTaskIndex = index;
        timer = setInterval(() => {
            task.time++;
            saveTasks(); // Save after every second
            renderTasks();
        }, 1000);
    }

    saveTasks();
    renderTasks();
}

function editTask(index) {
    const newTaskName = prompt("Edit task name:", tasks[index].name);
    if (newTaskName) {
        tasks[index].name = newTaskName;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'bg-white p-3 rounded shadow mb-2';
        taskDiv.innerHTML = `
            <h3 class="font-bold">${task.name}</h3>
            <p>Time: ${formatTime(task.time)}</p>
            <div class="flex items-center space-x-2">
                <button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="toggleTimer(${index})">
                    ${task.status === "running" ? "Pause" : "Start"}
                </button>
                <button onclick="editTask(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onclick="deleteTask(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
        `;
        taskList.appendChild(taskDiv);
    });
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
