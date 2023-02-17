// Define a function to fetch the list of tasks from the server
  async function fetchTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    return tasks;
  }
  
  // Define a function to render a single task in the DOM
  function renderTask(task) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', async () => {
      const response = await fetch(`/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: checkbox.checked
        })
      });
      const updatedTask = await response.json();
      const tasks = await fetchTasks();
      renderTasks(tasks);
    });
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(task.title));
    if (task.completed) {
      li.style.textDecoration = 'line-through';
    }
    return li;
  }
  
  // Define a function to render the list of tasks in the DOM
  function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = renderTask(task);
      taskList.appendChild(li);
    });
  }
  
  // Fetch the list of tasks and render them when the page loads
  window.addEventListener('load', async () => {
    const tasks = await fetchTasks();
    renderTasks(tasks);
  });
  
  // Define a function to handle the form submission to add a new task
  async function addTask(event) {
    event.preventDefault();
    const newTaskTitle = document.getElementById('new-task-title').value;
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: newTaskTitle
      })
    });
    const newTask = await response.json();
    const tasks = await fetchTasks();
    renderTasks(tasks);
    document.getElementById('new-task-title').value = '';
  }
  
  // Add an event listener to the form to call the addTask function on submit
  const form = document.querySelector('form');
  form.addEventListener('submit', addTask);
  