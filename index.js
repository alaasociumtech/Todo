document.addEventListener("DOMContentLoaded", () => {
  const newButton = document.querySelector(".btn-new");
  const inputCard = document.getElementById("input-card");
  const cancelButton = document.getElementById("cancel");
  const addButton = document.getElementById("add");
  const taskList = document.querySelector(".task-list");
  const taskTitleInput = document.getElementById("in");
  const taskDescriptionInput = inputCard.querySelector("textarea");
  const tabs = document.querySelectorAll(".tab");
  const actions = document.querySelector(".actions");
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let editingTask = null;

  newButton.addEventListener("click", () => {
    inputCard.style.display = "block";
    taskList.style.display = "none";
    actions.style.display = "none";
    clearInputs();
    addButton.innerHTML = `<span id="add-plus"><i class="fa-solid fa-circle-plus"></i></span>
            <span id="add-text">Add</span>`;
    editingTask = null;
  });

  cancelButton.addEventListener("click", () => {
    inputCard.style.display = "none";
    taskList.style.display = "";
    actions.style.display = "";

    clearInputs();
  });

  function clearInputs() {
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function createTaskElement(taskData) {
    const { title, description, completed } = taskData;
    const task = document.createElement("div");
    task.classList.add("task");

    task.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${
              completed ? "checked" : ""
            }/>
            <span class="task-name">${title}</span>
            <div class="task-content">          
              <p class="task-description">${description}</p>
            </div>
            <div class="task-actions">
              <button class="edit"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256">
              <path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z"></path>
              </svg></button>
              <button class="delete"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#e8e8e8" viewBox="0 0 256 256">
              <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
              </svg></button>
            </div>`;

    taskList.appendChild(task);

    const checkbox = task.querySelector(".task-checkbox");
    checkbox.addEventListener("change", () => {
      taskData.completed = checkbox.checked;
      saveTasks();
      updateTaskView();
    });

    task.querySelector(".edit").addEventListener("click", () => {
      taskTitleInput.value = title;
      taskDescriptionInput.value = description;
      inputCard.style.display = "block";
      addButton.innerHTML = `<span id="add-plus"><i class="fa-solid fa-circle-plus"></i></span>
              <span id="add-text">Update</span>`;
      editingTask = taskData;
      taskList.style.display = "none";
      actions.style.display = "none";
    });

    task.querySelector(".delete").addEventListener("click", () => {
      tasks = tasks.filter((t) => t !== taskData);
      task.remove();
      saveTasks();
      updateTaskView();
    });
  }

  function loadTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task) => createTaskElement(task));
    updateTaskView();
  }

  addButton.addEventListener("click", () => {
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();

    if (title === "") return;

    if (editingTask) {
      editingTask.title = title;
      editingTask.description = description;
      editingTask = null;
      addButton.innerHTML = `<span id="add-plus"><i class="fa-solid fa-circle-plus"></i></span>
              <span id="add-text">Add</span>`;
    } else {
      const newTask = { title, description, completed: false };
      tasks.push(newTask);
    }

    saveTasks();
    loadTasks();
    inputCard.style.display = "none";
    taskList.style.display = "";
    actions.style.display = "";

    clearInputs();
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      updateTaskView();
    });
  });

  function updateTaskView() {
    const activeTab = document.querySelector(".tab.active").textContent;

    let visibleTaskCount = 0;

    tasks.forEach((task, index) => {
      const taskElement = taskList.children[index];
      if (!taskElement) return;

      const isCompleted = task.completed;

      if (activeTab === "All") {
        taskElement.style.display = "flex";
        visibleTaskCount++;
      } else if (activeTab === "Pending") {
        if (isCompleted) {
          taskElement.style.display = "none";
        } else {
          taskElement.style.display = "flex";
          visibleTaskCount++;
        }
      } else if (activeTab === "Completed") {
        if (isCompleted) {
          taskElement.style.display = "flex";
          visibleTaskCount++;
        } else {
          taskElement.style.display = "none";
        }
      }
    });

    let noTaskMessage = document.getElementById("no-tasks-message");
    if (!noTaskMessage) {
      noTaskMessage = document.createElement("p");
      noTaskMessage.id = "no-tasks-message";
      noTaskMessage.textContent = "No tasks found!";
      noTaskMessage.style.textAlign = "center";
      noTaskMessage.style.color = "#999";
      noTaskMessage.style.display = "none";
      taskList.appendChild(noTaskMessage);
    }

    noTaskMessage.style.display = visibleTaskCount === 0 ? "" : "none";
  }

  loadTasks();
});
