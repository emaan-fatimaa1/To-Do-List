const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const priorityInput = document.getElementById("task-priority");
const dateInput = document.getElementById("task-date");
const taskList = document.getElementById("task-list");


// Add New Task
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const taskName = taskInput.value.trim();
    const priority = priorityInput.value;
    const date = dateInput.value;

    if (taskName === "") {
        return;
    }

    const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            task: taskName,
            priority: priority,
            due_date: date
        })
    });

    const result = await response.json();

    console.log(result);

    displayTask(result);

    form.reset();
});


// Display Task
function displayTask(task) {

    const li = document.createElement("li");

    const taskDetails = document.createElement("span");
    taskDetails.textContent = task.task;

    const priorityBadge = document.createElement("span");
    priorityBadge.textContent = task.priority;
    priorityBadge.classList.add(
        "priority-badge",
        task.priority.toLowerCase()
    );

    const taskInfo = document.createElement("small");
    taskInfo.textContent = `Due: ${task.due_date || "Not set"}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    // Delete Task
    deleteButton.addEventListener("click", async function() {

        const response = await fetch(`/api/tasks/${task.id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        console.log(result);

        if (response.ok) {
            li.remove();
        }
    });

    li.appendChild(taskDetails);
    li.appendChild(priorityBadge);
    li.appendChild(taskInfo);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
}


// Load Tasks from Database
async function loadTasks() {

    const response = await fetch("/api/tasks");

    const tasks = await response.json();

    tasks.forEach(function(task) {
        displayTask(task);
    });
}


// Load Tasks when Website Opens
loadTasks();