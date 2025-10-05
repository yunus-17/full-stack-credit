// API endpoints
let API_BASE_URL = 'http://localhost:3001/api';
let API_ENDPOINTS = {
    getTasks: `${API_BASE_URL}/tasks`,
    addTask: `${API_BASE_URL}/tasks`,
    updateTask: (id) => `${API_BASE_URL}/tasks/${id}`,
    deleteTask: (id) => `${API_BASE_URL}/tasks/${id}`,
    toggleTask: (id) => `${API_BASE_URL}/tasks/${id}/toggle`
};

// Initialize theme from local storage
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

// Authentication functions
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }
    updateUserInfo();
}

function getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

function updateUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
        const userInfoElement = document.querySelector('.user-info');
        if (userInfoElement) {
            userInfoElement.innerHTML = `
                <span>Welcome, ${userInfo.name}</span>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            `;
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
}

// Function to fetch tasks from the server
async function fetchTasks() {
    try {
        const port = await getServerPort();
        const response = await fetch(`http://localhost:${port}/api/tasks`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showNotification('Failed to load tasks', 'error');
        return [];
    }
}

// Function to save tasks to the server
async function saveTask(task) {
    try {
        const port = await getServerPort();
        const response = await fetch(`http://localhost:${port}/api/tasks`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Failed to save task');
        const savedTask = await response.json();
        return savedTask;
    } catch (error) {
        console.error('Error saving task:', error);
        showNotification('Failed to save task', 'error');
        throw error;
    }
}

// Function to get server port
async function getServerPort() {
    try {
        const response = await fetch('/api/port');
        const data = await response.json();
        return data.port;
    } catch (error) {
        console.error('Error getting server port:', error);
        return 3001; // Default port
    }
}

// Function to update a task on the server
async function updateTask(taskId, updates) {
    try {
        const response = await fetch(API_ENDPOINTS.updateTask(taskId), {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update task');
        const updatedTask = await response.json();
        return updatedTask;
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('Failed to update task', 'error');
        throw error;
    }
}

// Function to delete a task from the server
async function deleteTask(taskId) {
    try {
        const response = await fetch(API_ENDPOINTS.deleteTask(taskId), {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to delete task');
        return true;
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Failed to delete task', 'error');
        throw error;
    }
}

// Function to update statistics
function updateStatistics(tasks) {
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('activeTasks').textContent = activeTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

// Function to update theme icon
function updateThemeIcon() {
    const themeToggle = document.querySelector('.theme-toggle i');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    themeToggle.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Function to add a new task
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const prioritySelect = document.getElementById('priority');
    const categorySelect = document.getElementById('category');
    
    const title = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;
    const category = categorySelect.value;

    if (title === '') {
        showNotification('Please enter a task!', 'error');
        return;
    }

    try {
        const task = {
            title: title,
            description: '',  // Add description field
            dueDate: dueDate || null,
            priority: priority,
            category: category,
            completed: false
        };

        await saveTask(task);
        await fetchTasks();  // Refresh the task list
        
        // Clear inputs
        taskInput.value = '';
        dueDateInput.value = '';
        prioritySelect.value = 'medium';
        categorySelect.value = 'work';
        
        showNotification('Task added successfully!', 'success');
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Failed to add task. Please try again.', 'error');
    }
}

// Function to edit a task
async function editTask(taskId) {
    try {
        const port = await getServerPort();
        const response = await fetch(`http://localhost:${port}/api/tasks/${taskId}`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Failed to fetch task');
        const task = await response.json();
        
        document.getElementById('editTaskInput').value = task.title;
        document.getElementById('editDescription').value = task.description || '';
        document.getElementById('editDueDate').value = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
        document.getElementById('editPriority').value = task.priority;
        document.getElementById('editCategory').value = task.category;
        
        currentEditId = taskId;
        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching task:', error);
        showNotification('Failed to load task details', 'error');
    }
}

// Function to save edited task
async function saveEdit() {
    if (!currentEditId) return;

    try {
        const task = {
            title: document.getElementById('editTaskInput').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            dueDate: document.getElementById('editDueDate').value || null,
            priority: document.getElementById('editPriority').value,
            category: document.getElementById('editCategory').value
        };

        const port = await getServerPort();
        const response = await fetch(`http://localhost:${port}/api/tasks/${currentEditId}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(task)
        });

        if (!response.ok) throw new Error('Failed to update task');
        await fetchTasks();
        closeModal();
        showNotification('Task updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('Failed to update task', 'error');
    }
}

// Function to close modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditId = null;
}

// Function to search tasks
async function searchTasks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tasks = await fetchTasks();
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.category.toLowerCase().includes(searchTerm)
    );
    renderTasks(filteredTasks);
}

// Function to sort tasks
async function sortTasks() {
    const sortBy = document.getElementById('sortBy').value;
    const tasks = await fetchTasks();
    let sortedTasks = [...tasks];

    switch (sortBy) {
        case 'date':
            sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            break;
        case 'priority':
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        case 'category':
            sortedTasks.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }

    renderTasks(sortedTasks);
}

// Function to filter tasks
async function filterTasks(filter) {
    const tasks = await fetchTasks();
    const filteredTasks = tasks.filter(task => {
        switch (filter) {
            case 'active':
                return !task.completed;
            case 'completed':
                return task.completed;
            case 'high':
                return task.priority === 'high';
            default:
                return true;
        }
    });
    renderTasks(filteredTasks);
}

// Function to render tasks
async function renderTasks(tasksToRender = null) {
    try {
        const tasks = tasksToRender || await fetchTasks();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.completed ? 'completed' : ''} priority-${task.priority}`;
            taskElement.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="toggleTask('${task._id}', ${!task.completed})">
                    <span class="task-text">${task.title}</span>
                    ${task.description ? `<span class="task-description">${task.description}</span>` : ''}
                    <span class="category-badge">${task.category}</span>
                    ${task.dueDate ? `<span class="due-date">${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                </div>
                <div class="task-actions">
                    <button onclick="editTask('${task._id}')" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTask('${task._id}')" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            taskList.appendChild(taskElement);
        });

        updateStatistics(tasks);
    } catch (error) {
        console.error('Error rendering tasks:', error);
        showNotification('Failed to load tasks. Please try again.', 'error');
    }
}

// Event Listeners
document.getElementById('searchInput').addEventListener('input', searchTasks);
document.querySelector('.close').addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Function to show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to toggle task completion
async function toggleTask(taskId, completed) {
    try {
        const port = await getServerPort();
        const response = await fetch(`http://localhost:${port}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({ completed })
        });
        if (!response.ok) throw new Error('Failed to update task');
        await fetchTasks();
    } catch (error) {
        console.error('Error toggling task:', error);
        showNotification('Failed to update task', 'error');
    }
}

// Initialize API endpoints with correct port
async function initializeAPI() {
    const port = await getServerPort();
    API_BASE_URL = `http://localhost:${port}/api`;
    API_ENDPOINTS = {
        getTasks: `${API_BASE_URL}/tasks`,
        addTask: `${API_BASE_URL}/tasks`,
        updateTask: (id) => `${API_BASE_URL}/tasks/${id}`,
        deleteTask: (id) => `${API_BASE_URL}/tasks/${id}`,
        toggleTask: (id) => `${API_BASE_URL}/tasks/${id}/toggle`
    };
}

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    await initializeAPI();
    checkAuth();
    fetchTasks();
    setupEventListeners();
});
