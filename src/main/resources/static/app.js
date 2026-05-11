let jwtToken = localStorage.getItem('jwtToken');

// Base URL configuration
const API_BASE = '/api';

// Check auth on load
window.onload = function() {
    if (jwtToken) {
        showDashboard();
    }
};

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    };
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            jwtToken = data.token || data.jwt;
            localStorage.setItem('jwtToken', jwtToken);
            document.getElementById('loginError').style.display = 'none';
            showDashboard();
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('loginError').style.display = 'block';
    }
}

function logout() {
    jwtToken = null;
    localStorage.removeItem('jwtToken');
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
}

function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    fetchTime();
    loadTasks();
    loadNotes();
    // Update time every second locally
    setInterval(updateTime, 1000);
}

// --- Time API ---
async function fetchTime() {
    try {
        const response = await fetch(`${API_BASE}/utils/time`); // Без токена, так как время публичное
        if (response.ok) {
            const data = await response.json();
            document.getElementById('timeDisplay').innerText = `Current Time: ${data.time}`;
        }
    } catch (error) {
        console.error('Time error:', error);
    }
}

// Update time locally every second
function updateTime() {
    const now = new Date();
    const formatted = now.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('timeDisplay').innerText = `Current Time: ${formatted}`;
}

// --- Calculator API ---
async function calculate() {
    const a = document.getElementById('calcA').value;
    const b = document.getElementById('calcB').value;
    const op = document.getElementById('calcOp').value;
    
    if (!a || !b) return;

    try {
        const response = await fetch(`${API_BASE}/utils/calculator?a=${a}&b=${b}&operation=${op}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();

        if (response.ok) {
            document.getElementById('calcResult').innerText = `= ${data.result}`;
        } else {
            document.getElementById('calcResult').innerText = `Error: ${data.error}`;
        }
    } catch (error) {
        console.error('Calc error:', error);
    }
}

// --- Tasks CRUD ---
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`, { headers: getAuthHeaders() });
        if (response.ok) {
            const tasks = await response.json();
            const list = document.getElementById('taskList');
            list.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed-task' : '';
                li.innerHTML = `
                    <div>
                        <strong>${task.title}</strong><br>
                        <small>${task.description || ''}</small>
                    </div>
                    <div class="task-actions">
                        <button class="delete-btn" onclick="toggleTask(${task.id}, ${task.completed})">${task.completed ? 'Undo' : 'Done'}</button>
                        <button class="delete-btn" onclick="editTask(${task.id}, '${encodeForJs(task.title)}', '${encodeForJs(task.description || '')}', ${task.completed})">Edit</button>
                        <button class="delete-btn" onclick="deleteTask(${task.id})">Del</button>
                    </div>
                `;
                list.appendChild(li);
            });
        }
    } catch (error) { console.error('Tasks load error:', error); }
}

function encodeForJs(value) {
    return value.replace(/'/g, "\\'").replace(/\n/g, ' ');
}

async function createTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    if (!title) return;

    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, description, completed: false })
        });
        if (response.ok) {
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            loadTasks();
        }
    } catch (error) { console.error('Create task error:', error); }
}

async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${id}`, { headers: getAuthHeaders() });
        if (!response.ok) return;
        const task = await response.json();
        await updateTask(id, task.title, task.description, !completed);
    } catch (error) { console.error('Toggle task error:', error); }
}

async function editTask(id, title, description, completed) {
    const newTitle = prompt('Edit task title:', title);
    if (newTitle === null || newTitle.trim() === '') return;

    const newDescription = prompt('Edit task description:', description);
    if (newDescription === null) return;

    await updateTask(id, newTitle.trim(), newDescription.trim(), completed);
}

async function updateTask(id, title, description, completed) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, description, completed })
        });
        if (response.ok) loadTasks();
    } catch (error) { console.error('Update task error:', error); }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (response.ok) loadTasks();
    } catch (error) { console.error('Delete task error:', error); }
}

// --- Notes CRUD ---
async function loadNotes() {
    try {
        const response = await fetch(`${API_BASE}/notes`, { headers: getAuthHeaders() });
        if (response.ok) {
            const notes = await response.json();
            const list = document.getElementById('noteList');
            list.innerHTML = '';
            notes.forEach(note => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div>
                        <strong>${note.title}</strong><br>
                        <small>${note.content || ''}</small>
                    </div>
                    <div class="note-actions">
                        <button class="delete-btn" onclick="editNote(${note.id}, '${encodeForJs(note.title)}', '${encodeForJs(note.content || '')}')">Edit</button>
                        <button class="delete-btn" onclick="deleteNote(${note.id})">Del</button>
                    </div>
                `;
                list.appendChild(li);
            });
        }
    } catch (error) { console.error('Notes load error:', error); }
}

async function createNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    if (!title) return;

    try {
        const response = await fetch(`${API_BASE}/notes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, content })
        });
        if (response.ok) {
            document.getElementById('noteTitle').value = '';
            document.getElementById('noteContent').value = '';
            loadNotes();
        }
    } catch (error) { console.error('Create note error:', error); }
}

async function editNote(id, title, content) {
    const newTitle = prompt('Edit note title:', title);
    if (newTitle === null || newTitle.trim() === '') return;

    const newContent = prompt('Edit note content:', content);
    if (newContent === null) return;

    try {
        const response = await fetch(`${API_BASE}/notes/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title: newTitle.trim(), content: newContent.trim() })
        });
        if (response.ok) loadNotes();
    } catch (error) { console.error('Update note error:', error); }
}

async function deleteNote(id) {
    try {
        const response = await fetch(`${API_BASE}/notes/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (response.ok) loadNotes();
    } catch (error) { console.error('Delete note error:', error); }
}
