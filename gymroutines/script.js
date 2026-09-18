const STORAGE_KEY = 'gymroutines-data';
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const modal = document.querySelector('#modal');
const routineForm = document.querySelector('#routine-form');
const pendingExercises = document.querySelector('#pending-exercises');
const routineBoard = document.querySelector('#routine-board');
const emptyState = document.querySelector('#empty-state');
const formMessage = document.querySelector('#form-message');
const exerciseCount = document.querySelector('#exercise-count');
const routineCount = document.querySelector('#routine-count');
const nameInput = document.querySelector('#routine-name');
const dayInput = document.querySelector('#routine-day');
const exerciseNameInput = document.querySelector('#exercise-name');
const exerciseSetsInput = document.querySelector('#exercise-sets');
const exerciseRepsInput = document.querySelector('#exercise-reps');
const exerciseRestInput = document.querySelector('#exercise-rest');

let routines = loadRoutines();
let currentExercises = [];

function loadRoutines() {
  try {
    const savedRoutines = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedRoutines) ? savedRoutines : [];
  } catch {
    return [];
  }
}

function saveRoutines() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
}

function openModal() {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => nameInput.focus(), 50);
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  routineForm.reset();
  currentExercises = [];
  renderPendingExercises();
  showMessage('');
}

function showMessage(message) {
  formMessage.textContent = message;
}

function addExercise() {
  const name = exerciseNameInput.value.trim();
  const sets = exerciseSetsInput.value.trim();
  const reps = exerciseRepsInput.value.trim();
  const rest = exerciseRestInput.value.trim();

  if (!name || !sets || !reps || !rest) {
    showMessage('Completa todos los campos del ejercicio.');
    return;
  }

  if (Number(sets) < 1) {
    showMessage('Las series deben ser mayores que 0.');
    return;
  }

  currentExercises.push({ name, sets, reps, rest });
  exerciseNameInput.value = '';
  exerciseSetsInput.value = '';
  exerciseRepsInput.value = '';
  exerciseRestInput.value = '';
  showMessage('');
  renderPendingExercises();
  exerciseNameInput.focus();
}

function renderPendingExercises() {
  const count = currentExercises.length;
  exerciseCount.textContent = `${count} ${count === 1 ? 'ejercicio' : 'ejercicios'}`;
  pendingExercises.innerHTML = currentExercises.map((exercise, index) => `
    <div class="pending-row">
      <strong>${escapeHtml(exercise.name)}</strong>
      <small>${escapeHtml(exercise.sets)} series · ${escapeHtml(exercise.reps)} reps · ${escapeHtml(exercise.rest)}</small>
      <button class="delete-exercise" type="button" data-index="${index}" aria-label="Eliminar ${escapeHtml(exercise.name)}">×</button>
    </div>
  `).join('');
}

function saveRoutine(event) {
  event.preventDefault();
  const name = nameInput.value.trim();

  if (!name) {
    showMessage('Escribe un nombre para la rutina.');
    nameInput.focus();
    return;
  }

  if (currentExercises.length === 0) {
    showMessage('Agrega al menos un ejercicio antes de guardar.');
    return;
  }

  routines.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    day: dayInput.value,
    exercises: currentExercises.map((exercise) => ({ ...exercise }))
  });
  saveRoutines();
  renderRoutines();
  closeModal();
}

function renderRoutines() {
  routineCount.textContent = routines.length;
  emptyState.hidden = routines.length > 0;

  routineBoard.querySelectorAll('.day-column').forEach((column) => column.remove());
  DAYS.forEach((day) => {
    const dayRoutines = routines.filter((routine) => routine.day === day);
    const column = document.createElement('section');
    column.className = `day-column${dayRoutines.length ? ' is-active' : ''}`;
    column.innerHTML = `
      <div class="day-heading">
        <h2>${day}</h2>
        <span>${dayRoutines.length || '—'}</span>
      </div>
      ${dayRoutines.map(renderRoutineCard).join('')}
    `;
    routineBoard.appendChild(column);
  });
}

function renderRoutineCard(routine) {
  return `
    <article class="routine-card">
      <button class="delete-routine" type="button" data-routine-id="${routine.id}" aria-label="Eliminar rutina ${escapeHtml(routine.name)}">×</button>
      <h3>${escapeHtml(routine.name)}</h3>
      <ul>
        ${routine.exercises.map((exercise) => `
          <li class="exercise-row">
            <span class="exercise-name">${escapeHtml(exercise.name)}</span>
            <span class="exercise-meta">
              <span>${escapeHtml(exercise.sets)} series</span>
              <span>${escapeHtml(exercise.reps)} reps</span>
              <span>${escapeHtml(exercise.rest)}</span>
            </span>
          </li>
        `).join('')}
      </ul>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#039;',
    '"': '&quot;'
  }[character]));
}

document.querySelector('#open-modal').addEventListener('click', openModal);
document.querySelector('#empty-action').addEventListener('click', openModal);
document.querySelector('#close-modal').addEventListener('click', closeModal);
document.querySelector('#cancel-modal').addEventListener('click', closeModal);
document.querySelector('#add-exercise').addEventListener('click', addExercise);
routineForm.addEventListener('submit', saveRoutine);

pendingExercises.addEventListener('click', (event) => {
  const button = event.target.closest('[data-index]');
  if (!button) return;
  currentExercises.splice(Number(button.dataset.index), 1);
  renderPendingExercises();
});

routineBoard.addEventListener('click', (event) => {
  const button = event.target.closest('[data-routine-id]');
  if (!button) return;
  routines = routines.filter((routine) => routine.id !== button.dataset.routineId);
  saveRoutines();
  renderRoutines();
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

renderRoutines();
renderPendingExercises();
