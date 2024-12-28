const celebrationGifs = [
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
  'https://media.giphy.com/media/DhstvI3zZ598Nb1rFf/giphy.gif?cid=790b7611tpbcgj4w6i0t9k4fe0083rckw6axkugxo7885v2y&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/j3gsT2RsH9K0w/giphy.gif?cid=790b7611tpbcgj4w6i0t9k4fe0083rckw6axkugxo7885v2y&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/SGkufeMafyuBhIw796/giphy.gif?cid=790b7611tpbcgj4w6i0t9k4fe0083rckw6axkugxo7885v2y&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/8j3CTd8YJtAv6/giphy.gif?cid=ecf05e475jf78el0t9hwihidaz5wvwc0rn55atagwkweoktv&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/LUhUvH4BsfE9USnlPd/giphy.gif?cid=790b7611tpbcgj4w6i0t9k4fe0083rckw6axkugxo7885v2y&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/LUhUvH4BsfE9USnlPd/giphy.gif?cid=790b7611tpbcgj4w6i0t9k4fe0083rckw6axkugxo7885v2y&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGxzOWNmenRscnpoa3hiZDQzN3ZzMWtvdWFpdXo5ZGF2ZGNrMTAwOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/blSTtZehjAZ8I/giphy.gif',
  'https://media.giphy.com/media/HloNK1z39EkEQcreIo/giphy.gif?cid=790b7611tls9cfztlrzhkxbd437vs1kouaiuz9davdck1008&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/hryZ5xPHpPAQ/giphy.gif?cid=790b7611495ifb2tj702a0lwhzbj4ka30kbm560mjemsb1az&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/5dJnSUbvG4Xjq/giphy.gif?cid=790b7611495ifb2tj702a0lwhzbj4ka30kbm560mjemsb1az&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/yZaiNB8rIoJlm/giphy.gif?cid=790b7611495ifb2tj702a0lwhzbj4ka30kbm560mjemsb1az&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/ggDy5NyLc8w0ZZPGFe/giphy.gif?cid=790b76113i28kpavis1vg6qbylbknud63dj5c2ar5cmcy702&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/dkGhBWE3SyzXW/giphy.gif?cid=790b76113i28kpavis1vg6qbylbknud63dj5c2ar5cmcy702&ep=v1_gifs_search&rid=giphy.gif&ct=g'
];

let tasks = [];
let sidebarTasks = [];
let completedTasks = []; // New addition
let draggedTask = null;
let dragSource = null;

// Load saved data on startup
document.addEventListener('DOMContentLoaded', function() {
    try {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        sidebarTasks = JSON.parse(localStorage.getItem('sidebarTasks')) || [];
        completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        
        // Load saved notes
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            document.getElementById('notes-area').value = savedNotes;
        }
        
        renderAll();
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
        sidebarTasks = [];
        completedTasks = [];
    }
});

// Add keyboard shortcut for adding tasks
document.getElementById('sidebarTaskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addSidebarTask();
    }
});

  // Add notes auto-save functionality
  document.getElementById('notes-area').addEventListener('input', function(e) {
    localStorage.setItem('notes', e.target.value);
});

// Core functions
function addSidebarTask() {
    const taskInput = document.getElementById('sidebarTaskInput');
    if (taskInput.value.trim() === '') return;

    const task = {
        id: Date.now(),
        text: taskInput.value.trim(),
        completed: false
    };

    console.log('Adding task:', task);
    sidebarTasks.push(task);
    saveTasks();
    renderAll();
    taskInput.value = '';
}

function showCelebration() {
    // Remove any existing celebration overlays
    const existingOverlay = document.querySelector('.celebration-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const randomGif = celebrationGifs[Math.floor(Math.random() * celebrationGifs.length)];
    
    const overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';
    
    const gif = document.createElement('img');
    gif.className = 'celebration-gif';
    gif.src = randomGif;
    
    // Add loading handler
    gif.onload = () => {
        overlay.appendChild(gif);
        document.body.appendChild(overlay);
        
        // Remove the overlay after animation
        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }, 2000);
    };

    // Error handling for gif loading
    gif.onerror = () => {
        console.error('Failed to load celebration gif:', randomGif);
    };
}

function toggleTask(taskId, isSidebar = false) {
    let taskList = isSidebar ? sidebarTasks : tasks;
    let task = taskList.find(t => t.id === taskId);
    
    if (task && !task.completed) {
        showCelebration();
        // Move task to completed list
        const completedTask = {...task, completed: true, source: isSidebar ? 'sidebar' : 'matrix'};
        completedTasks.push(completedTask);
        
        // Remove from original list
        if (isSidebar) {
            sidebarTasks = sidebarTasks.filter(t => t.id !== taskId);
        } else {
            tasks = tasks.filter(t => t.id !== taskId);
        }
    }
    
    saveTasks();
    renderAll();
}

function clearCompletedTasks() {
    completedTasks = [];
    saveTasks();
    renderAll();
}

function clearNotes() {
    document.getElementById('notes-area').value = '';
    localStorage.removeItem('notes');
}

function renderCompletedTasks() {
    const completedEl = document.getElementById('completed-tasks');
    const completedContainer = document.getElementById('completed-container');
    completedEl.innerHTML = '';
    
    // Hide the completed section if there are no completed tasks
    if (completedTasks.length === 0) {
        completedContainer.style.display = 'none';
        return;
    }
    
    completedContainer.style.display = 'block';
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item completed';
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" checked disabled>
                <span>${task.text}</span>
            </div>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteCompletedTask(${task.id})">×</button>
            </div>
        `;
        completedEl.appendChild(li);
    });
}

function deleteCompletedTask(taskId) {
    completedTasks = completedTasks.filter(task => task.id !== taskId);
    saveTasks();
    renderAll();
}

function deleteTask(taskId, isSidebar = false) {
    if (isSidebar) {
        sidebarTasks = sidebarTasks.filter(task => task.id !== taskId);
    } else {
        tasks = tasks.filter(task => task.id !== taskId);
    }
    saveTasks();
    renderAll();
}

function moveToInbox(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        tasks = tasks.filter(t => t.id !== taskId);
        sidebarTasks.push({
            id: task.id,
            text: task.text,
            completed: task.completed
        });
        saveTasks();
        renderAll();
    }
}

// Drag and Drop handlers
function handleDragStart(e, taskId, source) {
    draggedTask = taskId;
    dragSource = source;
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.task-list');
    if (dropZone) {
        dropZone.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.task-list');
    if (dropZone) {
        const rect = dropZone.getBoundingClientRect();
        const isLeaving = 
            e.clientX < rect.left ||
            e.clientX >= rect.right ||
            e.clientY < rect.top ||
            e.clientY >= rect.bottom;
        
        if (isLeaving) {
            dropZone.classList.remove('drag-over');
        }
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.task-list');
    if (!dropZone) return;

    dropZone.classList.remove('drag-over');
    const targetId = dropZone.id;

    if (dragSource === 'sidebar' && targetId !== 'sidebar-tasks') {
        const task = sidebarTasks.find(t => t.id === draggedTask);
        if (task) {
            sidebarTasks = sidebarTasks.filter(t => t.id !== draggedTask);
            tasks.push({
                ...task,
                quadrant: targetId
            });
        }
    } else if (dragSource === 'matrix' && targetId === 'sidebar-tasks') {
        const task = tasks.find(t => t.id === draggedTask);
        if (task) {
            tasks = tasks.filter(t => t.id !== draggedTask);
            sidebarTasks.push({
                id: task.id,
                text: task.text,
                completed: task.completed
            });
        }
    } else if (dragSource === 'matrix' && targetId !== 'sidebar-tasks') {
        tasks = tasks.map(task => 
            task.id === draggedTask 
                ? {...task, quadrant: targetId}
                : task
        );
    }

    saveTasks();
    renderAll();
}

// Render functions
function renderSidebar() {
    const sidebarEl = document.getElementById('sidebar-tasks');
    sidebarEl.innerHTML = '';

    sidebarTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.draggable = true;
        li.ondragstart = (e) => handleDragStart(e, task.id, 'sidebar');
        li.ondragend = handleDragEnd;
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id}, true)">
                <span>${task.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id}, true)">×</button>
        `;
        sidebarEl.appendChild(li);
    });
}

function renderMatrix() {
    const quadrants = [
        'urgent-important',
        'not-urgent-important',
        'urgent-not-important',
        'not-urgent-not-important'
    ];

    quadrants.forEach(quadrant => {
        const quadrantEl = document.getElementById(quadrant);
        quadrantEl.innerHTML = '';

        const quadrantTasks = tasks.filter(task => task.quadrant === quadrant);

        quadrantTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.draggable = true;
            li.ondragstart = (e) => handleDragStart(e, task.id, 'matrix');
            li.ondragend = handleDragEnd;
            
            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';
            taskContent.innerHTML = `
                <input type="checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id})">
                <span>${task.text}</span>
            `;

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';
            taskActions.innerHTML = `
                <button class="back-btn" onclick="moveToInbox(${task.id})" title="Move to Inbox">
                    ↩
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
            `;

            li.appendChild(taskContent);
            li.appendChild(taskActions);
            quadrantEl.appendChild(li);
        });
    });
}

function renderAll() {
    renderSidebar();
    renderMatrix();
    renderCompletedTasks();
}

function saveTasks() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('sidebarTasks', JSON.stringify(sidebarTasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        console.log('Tasks saved successfully');
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

function debugTasks() {
    console.log('Current tasks:', tasks);
    console.log('Current sidebar tasks:', sidebarTasks);
    console.log('Current completed tasks:', completedTasks);
}