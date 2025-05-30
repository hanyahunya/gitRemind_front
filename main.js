import { API_BASE_URL } from "./config.js";

const timeGrid = document.getElementById("time-grid");
const commitStatusEl = document.getElementById("commit-status");
const usernameEl = document.getElementById("username");
const applyBtn = document.getElementById("apply-btn");

// 1시부터 23시까지
const allTimes = Array.from({ length: 23 }, (_, i) => `${i + 1}:00`);

let selectedTimes = new Set();

function renderTimeGrid() {
  timeGrid.innerHTML = "";
  allTimes.forEach(time => {
    const div = document.createElement("div");
    div.className = "time-slot";
    div.textContent = time;
    if (selectedTimes.has(time)) {
      div.classList.add("active");
    }
    div.onclick = () => {
      if (selectedTimes.has(time)) {
        selectedTimes.delete(time);
        div.classList.remove("active");
      } else {
        selectedTimes.add(time);
        div.classList.add("active");
      }
    };
    timeGrid.appendChild(div);
  });
}

function fetchAlarmSettings() {
  fetch(`${API_BASE_URL}/alarm`)
    .then(res => res.json())
    .then(data => {
      selectedTimes = new Set(data); // 예: ["9:00", "18:00"]
      renderTimeGrid();
    });
}

function fetchCommitStatus() {
  fetch(`${API_BASE_URL}/status`)
    .then(res => res.json())
    .then(data => {
      commitStatusEl.textContent = data.committed
        ? "오늘은 커밋을 완료했습니다."
        : "아직 커밋하지 않았습니다.";
    });
}

function fetchGitUsername() {
  fetch(`${API_BASE_URL}/git-username`)
    .then(res => res.text())
    .then(name => {
      usernameEl.textContent = name;
    });
}

applyBtn.onclick = () => {
  const times = Array.from(selectedTimes);
  fetch(`${API_BASE_URL}/alarm`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(times),
  })
    .then(res => {
      if (res.ok) alert("적용 완료");
      else throw new Error();
    })
    .catch(() => alert("적용 실패"));
};

fetchAlarmSettings();
fetchCommitStatus();
fetchGitUsername();
