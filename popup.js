// Task list code
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load saved tasks
chrome.storage.sync.get(["tasks"], (result) => {
  const tasks = result.tasks || [];
  tasks.forEach(addTaskToUI);
});

addTaskBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  if (task === "") return;
  addTaskToUI(task);
  saveTask(task);
  taskInput.value = "";
});

function addTaskToUI(task) {
  const li = document.createElement("li");
  li.textContent = task;

  const delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.style.marginLeft = "10px";
  delBtn.onclick = () => {
    li.remove();
    removeTask(task);
  };

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function saveTask(task) {
  chrome.storage.sync.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    tasks.push(task);
    chrome.storage.sync.set({ tasks });
  });
}

function removeTask(task) {
  chrome.storage.sync.get(["tasks"], (result) => {
    let tasks = result.tasks || [];
    tasks = tasks.filter(t => t !== task);
    chrome.storage.sync.set({ tasks });
  });
}

// Pomodoro Timer code
const timerEl = document.getElementById("timer");
const startTimerBtn = document.getElementById("startTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");

let timer;
let timeLeft = 25 * 60; // 25 minutes

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimerDisplay();
  } else {
    clearInterval(timer);
    alert("Pomodoro session ended! Take a break.");
  }
}

startTimerBtn.onclick = () => {
  if (!timer) {
    timer = setInterval(tick, 1000);
  }
};

resetTimerBtn.onclick = () => {
  clearInterval(timer);
  timer = null;
  timeLeft = 25 * 60;
  updateTimerDisplay();
};

updateTimerDisplay();
