const STORAGE_KEY = "todo-1-tasks";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const pendingCount = document.querySelector("#pending-count");
const allCount = document.querySelector("#all-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");
const footerMessage = document.querySelector("#footer-message");
const clearCompletedButton = document.querySelector("#clear-completed");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = loadTasks();
let currentFilter = "all";

document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long"
}).format(new Date());

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(title) {
    return {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        completed: false
    };
}

function render() {
    const visibleTasks = tasks.filter((task) => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    taskList.innerHTML = "";

    if (visibleTasks.length === 0) {
        const emptyMessage = currentFilter === "completed"
            ? "Todavía no has completado tareas."
            : currentFilter === "active"
                ? "No tienes tareas pendientes."
                : "Añade tu primera tarea para empezar.";

        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon" aria-hidden="true">${currentFilter === "completed" ? "✓" : "＋"}</div>
                <p>${emptyMessage}</p>
            </div>
        `;
    } else {
        visibleTasks.forEach((task) => taskList.appendChild(createTaskElement(task)));
    }

    updateCounters();
}

function createTaskElement(task) {
    const item = document.createElement("article");
    item.className = `task-item${task.completed ? " is-completed" : ""}`;
    item.dataset.id = task.id;

    const checkButton = document.createElement("button");
    checkButton.className = "check-button";
    checkButton.type = "button";
    checkButton.setAttribute("aria-label", task.completed ? "Marcar como pendiente" : "Marcar como completada");
    checkButton.setAttribute("aria-pressed", String(task.completed));
    checkButton.addEventListener("click", () => toggleTask(task.id));

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `Eliminar tarea: ${task.title}`);
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    item.append(checkButton, title, deleteButton);
    return item;
}

function updateCounters() {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const activeTasks = tasks.length - completedTasks;

    pendingCount.textContent = activeTasks;
    allCount.textContent = tasks.length;
    activeCount.textContent = activeTasks;
    completedCount.textContent = completedTasks;
    clearCompletedButton.disabled = completedTasks === 0;

    if (tasks.length === 0) {
        footerMessage.textContent = "Todo en orden.";
    } else if (activeTasks === 0) {
        footerMessage.textContent = "Has completado todo por hoy.";
    } else {
        footerMessage.textContent = `${activeTasks} ${activeTasks === 1 ? "tarea pendiente" : "tareas pendientes"}`;
    }
}

function addTask(title) {
    tasks.unshift(createTask(title));
    saveTasks();
    render();
}

function toggleTask(taskId) {
    tasks = tasks.map((task) => task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    );
    saveTasks();
    render();
}

function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    render();
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    addTask(title);
    taskInput.value = "";
    taskInput.focus();
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        filterButtons.forEach((filterButton) => {
            filterButton.classList.toggle("is-active", filterButton === button);
        });
        render();
    });
});

clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    render();
});

render();
