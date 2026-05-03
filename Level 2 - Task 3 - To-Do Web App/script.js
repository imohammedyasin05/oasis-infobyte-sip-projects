class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.filter = 'all';
        this.editingTaskId = null;
        
        this.init();
    }

    init() {
        this.renderTasks();
        this.updateStats();
        this.setGreeting();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Form Submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.dataset.filter;
                this.renderTasks();
            });
        });

        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            document.getElementById('themeToggle').innerHTML = `<i data-lucide="${isDark ? 'moon' : 'sun'}"></i>`;
            lucide.createIcons();
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const priority = document.getElementById('taskPriority').value;
        const text = input.value.trim();

        if (text) {
            const task = {
                id: Date.now(),
                text,
                priority,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.tasks.unshift(task);
            this.save();
            this.renderTasks();
            input.value = '';
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#6366f1', '#818cf8', '#10b981']
                });
            }
            this.save();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
        this.renderTasks();
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.editingTaskId = id;
            document.getElementById('editTaskInput').value = task.text;
            document.getElementById('editModal').style.display = 'flex';
        }
    }

    saveEdit() {
        const newText = document.getElementById('editTaskInput').value.trim();
        if (newText && this.editingTaskId) {
            const task = this.tasks.find(t => t.id === this.editingTaskId);
            if (task) task.text = newText;
            this.closeModal();
            this.save();
            this.renderTasks();
        }
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTaskId = null;
    }

    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.updateStats();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('percentComplete').textContent = `${percent}%`;
        document.getElementById('statsSummary').textContent = `${completed} of ${total} tasks done`;
        
        // Update Progress Circle
        const circle = document.getElementById('progressCircle');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        const offset = circumference - (percent / 100 * circumference);
        circle.style.strokeDashoffset = offset;

        document.getElementById('taskCount').textContent = total;
    }

    setGreeting() {
        const hour = new Date().getHours();
        let greeting = "Good Morning";
        if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
        if (hour >= 17) greeting = "Good Evening";
        
        document.getElementById('greeting').textContent = `${greeting}, Developer!`;
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric'
        });
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        taskList.innerHTML = '';

        let filteredTasks = this.tasks;
        if (this.filter === 'pending') filteredTasks = this.tasks.filter(t => !t.completed);
        if (this.filter === 'completed') filteredTasks = this.tasks.filter(t => t.completed);

        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filteredTasks.forEach(task => {
                const card = document.createElement('div');
                card.className = `task-card ${task.completed ? 'completed' : ''}`;
                card.innerHTML = `
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="taskManager.toggleTask(${task.id})"></div>
                    <div class="task-content">
                        <div class="task-text">${task.text}</div>
                        <div class="task-meta">
                            <span class="priority-tag ${task.priority}">${task.priority}</span>
                            <span>• Created ${new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn edit" onclick="taskManager.openEditModal(${task.id})"><i data-lucide="edit-3"></i></button>
                        <button class="action-btn delete" onclick="taskManager.deleteTask(${task.id})"><i data-lucide="trash-2"></i></button>
                    </div>
                `;
                taskList.appendChild(card);
            });
            lucide.createIcons();
        }
    }
}

const taskManager = new TaskManager();

// Modal Actions
document.getElementById('cancelEdit').addEventListener('click', () => taskManager.closeModal());
document.getElementById('saveEdit').addEventListener('click', () => taskManager.saveEdit());
window.onclick = (e) => {
    if (e.target == document.getElementById('editModal')) taskManager.closeModal();
};
