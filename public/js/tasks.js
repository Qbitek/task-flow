const apiBaseUrl = '/api';

async function fetchApi(url, options = {}) {
    try {
        const response = await fetch(`${apiBaseUrl}${url}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        
        if (!response.ok) {
            if (response.status === 204) {
                return null;
            }
            const error = await response.json();
            throw new Error(error.error || 'Błąd serwera');
        }
        
        return response.status === 204 ? null : await response.json();
    } catch (error) {
        console.error('Błąd:', error);
        throw error;
    }
}

async function loadTasks() {
    const tasksList = document.getElementById('tasksList');
    
    try {
        const tasks = await fetchApi('/tasks');
        
        if (!tasks || tasks.length === 0) {
            tasksList.innerHTML = '<div class="alert alert-info">Brak zadań do wyświetlenia.</div>';
            return;
        }
        
        let html = '';
        tasks.forEach(task => {
            const statusText = {
                'to_do': 'Do zrobienia',
                'in_progress': 'W trakcie',
                'done': 'Zrobione'
            }[task.status] || task.status;
            
            html += `
                <div class="item-card" data-task-id="${task.id}">
                    <div class="item-title">${task.title}</div>
                    <div class="item-meta">
                        <strong>Opis:</strong> ${task.description || 'Brak opisu'}<br>
                        <strong>Przypisane do:</strong> ${task.user_name}<br>
                        <strong>Status:</strong> <span class="status ${task.status}">${statusText}</span><br>
                        <strong>Utworzono:</strong> ${new Date(task.created_at).toLocaleString()}
                    </div>
                    <div class="item-actions">
                        <button class="btn change-status-btn" data-id="${task.id}" data-status="to_do">Do zrobienia</button>
                        <button class="btn change-status-btn" data-id="${task.id}" data-status="in_progress">W trakcie</button>
                        <button class="btn btn-success change-status-btn" data-id="${task.id}" data-status="done">Zrobione</button>
                        <button class="btn btn-danger delete-task-btn" data-id="${task.id}">Usuń</button>
                    </div>
                </div>
            `;
        });
        
        tasksList.innerHTML = html;
    } catch (error) {
        tasksList.innerHTML = `<div class="alert alert-error">Błąd ładowania: ${error.message}</div>`;
    }
}

async function changeStatus(taskId, newStatus) {
    try {
        await fetchApi(`/tasks/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus })
        });
        await loadTasks();
        showMessage('Status zaktualizowany', 'success');
    } catch (error) {
        showMessage('Błąd: ' + error.message, 'error');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) return;
    
    try {
        await fetchApi(`/tasks/${taskId}`, { method: 'DELETE' });
        await loadTasks();
        showMessage('Zadanie usunięte', 'success');
    } catch (error) {
        showMessage('Błąd: ' + error.message, 'error');
    }
}

function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.textContent = text;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => messageDiv.remove(), 3000);
}

async function setupAddTaskForm() {
    const modal = document.getElementById('addTaskModal');
    const form = document.getElementById('addTaskForm');
    const showBtn = document.getElementById('showAddTaskFormBtn');
    const closeBtn = modal.querySelector('.close');

    try {
        const users = await fetchApi('/users');
        const select = form.querySelector('select[name="user_id"]');
        
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name + ' (' + user.email + ')';
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Nie można załadować użytkowników:', error);
    }

    showBtn.onclick = () => {
        modal.style.display = 'block';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            user_id: parseInt(formData.get('user_id'))
        };

        try {
            await fetchApi('/tasks', {
                method: 'POST',
                body: JSON.stringify(taskData)
            });
            modal.style.display = 'none';
            form.reset();
            await loadTasks();
            showMessage('Zadanie dodane', 'success');
        } catch (error) {
            showMessage('Błąd: ' + error.message, 'error');
        }
    };
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('change-status-btn')) {
        const taskId = e.target.dataset.id;
        const newStatus = e.target.dataset.status;
        changeStatus(taskId, newStatus);
    }
    
    if (e.target.classList.contains('delete-task-btn')) {
        const taskId = e.target.dataset.id;
        deleteTask(taskId);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupAddTaskForm();
});