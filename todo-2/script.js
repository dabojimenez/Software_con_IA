const STORAGE_KEY = "todo-2-tasks";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const filterButtons = document.querySelectorAll("[data-filter]");
const clearCompletedButton = document.querySelector("#clear-completed");

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
        const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
        return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
    const visibleTasks = tasks.filter((task) => currentFilter === "all"
        || (currentFilter === "active" && !task.completed)
        || (currentFilter === "completed" && task.completed));

    taskList.replaceChildren();
    if (visibleTasks.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        const icon = document.createElement("div");
        icon.className = "empty-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = currentFilter === "completed" ? "✓" : "+";
        const message = document.createElement("p");
        message.textContent = currentFilter === "completed"
            ? "Todavía no has completado tareas."
            : currentFilter === "active" ? "No tienes tareas pendientes." : "Añade tu primera tarea para empezar.";
        emptyState.append(icon, message);
        taskList.append(emptyState);
    } else {
        visibleTasks.forEach((task) => taskList.append(createTaskElement(task)));
    }
    updateCounters();
}

function createTaskElement(task) {
    const item = document.createElement("article");
    item.className = `task-item${task.completed ? " is-completed" : ""}`;

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
    const completed = tasks.filter((task) => task.completed).length;
    const active = tasks.length - completed;
    document.querySelector("#pending-count").textContent = active;
    document.querySelector("#all-count").textContent = tasks.length;
    document.querySelector("#active-count").textContent = active;
    document.querySelector("#completed-count").textContent = completed;
    clearCompletedButton.disabled = completed === 0;
    document.querySelector("#footer-message").textContent = tasks.length === 0
        ? "Todo en orden."
        : active === 0 ? "Has completado todo por hoy." : `${active} ${active === 1 ? "tarea pendiente" : "tareas pendientes"}`;
}

function addTask(title) {
    tasks.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, title, completed: false });
    saveTasks();
    render();
}

function toggleTask(taskId) {
    tasks = tasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task);
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

filterButtons.forEach((button) => button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => filterButton.classList.toggle("is-active", filterButton === button));
    render();
}));

clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    render();
});

render();