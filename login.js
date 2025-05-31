const API_BASE_URL = "http://localhost:8080"; 

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("loginId").value;
    const password = document.getElementById("password").value;

    fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", 
      body: JSON.stringify({
        username,
        password
      }),
    })
      .then(res => {
        if (res.ok) {
          alert("로그인 성공!");
          window.location.href = "main.html"; 
        } else {
          throw new Error();
        }
      })
      .catch(() => alert("로그인 실패. 아이디 또는 비밀번호를 확인하세요."));
  });
});
