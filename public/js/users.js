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

async function loadUsers() {
    const usersList = document.getElementById('usersList');
    
    try {
        const users = await fetchApi('/users');
        
        if (!users || users.length === 0) {
            usersList.innerHTML = '<div class="alert alert-info">Brak użytkowników do wyświetlenia.</div>';
            return;
        }
        
        let html = '';
        users.forEach(user => {
            html += `
                <div class="item-card" data-user-id="${user.id}">
                    <div class="item-title">${user.name}</div>
                    <div class="item-meta">
                        <strong>Email:</strong> ${user.email}<br>
                        <strong>Dołączył:</strong> ${new Date(user.created_at).toLocaleString()}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-danger delete-user-btn" data-id="${user.id}">Usuń</button>
                    </div>
                </div>
            `;
        });
        
        usersList.innerHTML = html;
    } catch (error) {
        usersList.innerHTML = `<div class="alert alert-error">Błąd ładowania: ${error.message}</div>`;
    }
}

async function deleteUser(userId) {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika? Wszystkie jego zadania również zostaną usunięte.')) return;
    
    try {
        await fetchApi(`/users/${userId}`, { method: 'DELETE' });
        await loadUsers();
        showMessage('Użytkownik usunięty', 'success');
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

async function setupAddUserForm() {
    const modal = document.getElementById('addUserModal');
    const form = document.getElementById('addUserForm');
    const showBtn = document.getElementById('showAddUserFormBtn');
    const closeBtn = modal.querySelector('.close');

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
        const userData = {
            name: formData.get('name'),
            email: formData.get('email')
        };

        try {
            await fetchApi('/users', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            modal.style.display = 'none';
            form.reset();
            await loadUsers();
            showMessage('Użytkownik dodany', 'success');
        } catch (error) {
            showMessage('Błąd: ' + error.message, 'error');
        }
    };
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-user-btn')) {
        const userId = e.target.dataset.id;
        deleteUser(userId);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupAddUserForm();
});