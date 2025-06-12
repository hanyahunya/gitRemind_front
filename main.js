const API_BASE_URL = "http://localhost:8080/contributions";

const timeGrid = document.getElementById("time-grid");
const commitStatusEl = document.getElementById("commit-status");
const usernameEl = document.getElementById("username");
const applyBtn = document.getElementById("apply-btn");
const usernameWrapper = document.getElementById("username-wrapper");
const gridWrapper = document.getElementById("grid-wrapper");
const statusWrapper = document.getElementById("status-wrapper");

const usernameInputArea = document.getElementById("username-input-area");
const usernameInput = document.getElementById("username-input");
const usernameSubmit = document.getElementById("username-submit");

// 1시부터 23시까지
const allTimes = Array.from({ length: 23 }, (_, i) => `${i + 1}:00`);

let selectedTimes = new Set();

usernameSubmit.onclick = () => {
  const name = usernameInput.value.trim();
  if (!name) return;

  fetch(`${API_BASE_URL}/git-username`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ gitUsername: name }),
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.text();
    })
    .then(() => {
      // 입력 후 다시 fetch
      fetchGitUsername();
    })
    .catch(() => {
      alert("깃허브 유저이름 등록에 실패했습니다.");
    });
};

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
  fetch(`${API_BASE_URL}/alarm`, {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      console.log("fetchAlarmSettings data:", data); // 데이터 확인용 로그
      selectedTimes = new Set(data.data.alarmHours.map(h => `${h}:00`));
      renderTimeGrid();
    });
}


function fetchCommitStatus() {
  fetch(`${API_BASE_URL}/status`, {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      commitStatusEl.textContent = data.data.committed
        ? "오늘은 커밋을 완료했습니다."
        : "아직 커밋하지 않았습니다.";
    });
}

function fetchGitUsername() {
  fetch(`${API_BASE_URL}/git-username`, {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      console.log("fetchGitUsername data:", data); // 데이터 확인용 로그
      
      if (!data.success || !data.data?.gitUsername) {
        usernameEl.textContent = "깃허브 유저이름을 먼저 등록해주세요.";
        usernameInputArea.style.display = "block";
        gridWrapper.style.display = "none";
        statusWrapper.style.display = "none";
        applyBtn.style.display = "none";
      } else {
        usernameEl.textContent = data.data.gitUsername;
        usernameInputArea.style.display = "none";
        gridWrapper.style.display = "block";
        statusWrapper.style.display = "block";
        applyBtn.style.display = "inline-block";
        fetchAlarmSettings();
        fetchCommitStatus();
      }
    })
    .catch(err => {
      console.error("fetchGitUsername error:", err);
    });
}




applyBtn.onclick = () => {
  const times = Array.from(selectedTimes).map(t => parseInt(t));
  fetch(`${API_BASE_URL}/alarm`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ alarmHours: times }), // 객체로 감싸기
  })
    .then(res => {
      if (res.ok) alert("적용 완료");
      else throw new Error();
    })
    .catch(() => alert("적용 실패"));
};



// 시작 시 유저네임 먼저 체크
fetchGitUsername();

const profileIcon = document.getElementById("profile-icon");
const dropdownMenu = document.getElementById("dropdown-menu");
const logoutBtn = document.getElementById("logout-btn");

// 드롭다운 토글
profileIcon.onclick = () => {
  dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
};

// 로그아웃 처리
logoutBtn.onclick = () => {
  fetch("http://localhost:8080/member/logout", {
    method: "POST",
    credentials: "include",
  })
    .then(res => {
      if (res.ok) {
        alert("로그아웃되었습니다.");
        location.reload(); // 또는 location.href = "/login.html"; 원하는 페이지로 이동
      } else {
        throw new Error();
      }
    })
    .catch(() => {
      alert("로그아웃 실패");
    });
};

// 외부 클릭 시 드롭다운 닫기
document.addEventListener("click", (event) => {
  if (!event.target.closest(".profile-dropdown")) {
    dropdownMenu.style.display = "none";
  }
});
