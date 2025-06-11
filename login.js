const API_BASE_URL = "http://localhost:8080"; 

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  const messageEl = document.getElementById("login-message");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const loginId = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${API_BASE_URL}/member/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", 
      body: JSON.stringify({
        loginId,
        password
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.location.href = "main.html";
        } else {
          messageEl.textContent = "아이디 또는 비밀번호를 확인하세요.";
        }
      })
      .catch(() => {
        messageEl.textContent = "로그인 중 오류가 발생했습니다.";
      });
  });
});
