const userLang = navigator.language || navigator.userLanguage;

if (userLang.startsWith('en')) {
  document.querySelector('.main-content h1').textContent = 'Never miss a commit';
  document.querySelector('.get-started').textContent = 'Get Started';
  document.getElementById('loginBtn').textContent = 'Login';
  document.getElementById('signupBtn').textContent = 'Sign Up';
} else if (userLang.startsWith('ja')) {
  document.querySelector('.main-content h1').textContent = '今日の分、コミットしましたか？';
  document.querySelector('.get-started').textContent = '始める';
  document.getElementById('loginBtn').textContent = 'ログイン';
  document.getElementById('signupBtn').textContent = '新規登録';
} else {
}


document.getElementById('loginBtn').addEventListener('click', () => {
    window.location.href = 'login.html';
    // alert('로그인 페이지로 이동합니다.');
  });
  
  document.getElementById('signupBtn').addEventListener('click', () => {
        window.location.href = 'signup.html';
    // alert('회원가입 페이지로 이동합니다.');
  });
  