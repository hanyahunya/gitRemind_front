const API_BASE_URL = "http://localhost:8080";

const lang = navigator.language.startsWith('ja') ? 'ja'
           : navigator.language.startsWith('en') ? 'en'
           : 'ko';

const text = {
  ko: {
    title: '회원가입',
    loginId: '아이디',
    password: '비밀번호',
    country: '국가',
    email: '이메일',
    sendBtn: '이메일 인증 요청',
    authCode: '인증번호',
    verifyBtn: '인증번호 확인',
    submitBtn: '회원가입',
    alertEnterEmail: '이메일을 입력하세요.',
    alertSent: '인증번호가 이메일로 전송되었습니다.',
    alertSendFail: '인증 요청 실패',
    alertSuccess: '이메일 인증이 완료되었습니다.',
    alertCodeWrong: '인증번호가 올바르지 않습니다.',
    alertNeedVerify: '이메일 인증을 먼저 완료해주세요.',
    alertJoinSuccess: '회원가입이 완료되었습니다.',
    alertJoinFail: '회원가입 실패',
  },
  ja: {
    title: 'アカウント登録',
    loginId: 'ユーザーID',
    password: 'パスワード',
    country: '国',
    email: 'メールアドレス',
    sendBtn: '認証コードを送信',
    authCode: '認証コード',
    verifyBtn: '認証を確認',
    submitBtn: '登録',
    alertEnterEmail: 'メールアドレスを入力してください。',
    alertSent: '認証コードが送信されました。',
    alertSendFail: '認証リクエストに失敗しました。',
    alertSuccess: 'メール認証が完了しました。',
    alertCodeWrong: '認証コードが正しくありません。',
    alertNeedVerify: 'メール認証を完了してください。',
    alertJoinSuccess: '登録が完了しました。',
    alertJoinFail: '登録に失敗しました。',
  },
  en: {
    title: 'Sign Up',
    loginId: 'Username',
    password: 'Password',
    country: 'Country',
    email: 'Email',
    sendBtn: 'Send Auth Code',
    authCode: 'Auth Code',
    verifyBtn: 'Verify Code',
    submitBtn: 'Sign Up',
    alertEnterEmail: 'Please enter your email.',
    alertSent: 'Auth code sent to your email.',
    alertSendFail: 'Failed to send code.',
    alertSuccess: 'Email verified.',
    alertCodeWrong: 'Invalid auth code.',
    alertNeedVerify: 'Please verify your email first.',
    alertJoinSuccess: 'Signup completed.',
    alertJoinFail: 'Signup failed.',
  }
};

const t = text[lang];
document.getElementById("title").textContent = t.title;
document.getElementById("labelLoginId").textContent = t.loginId;
document.getElementById("labelPassword").textContent = t.password;
document.getElementById("labelCountry").textContent = t.country;
document.getElementById("labelEmail").textContent = t.email;
document.getElementById("sendBtn").textContent = t.sendBtn;
document.getElementById("labelAuthCode").textContent = t.authCode;
document.getElementById("verifyBtn").textContent = t.verifyBtn;
document.getElementById("submitBtn").textContent = t.submitBtn;

document.getElementById("sendBtn").addEventListener("click", sendAuthCode);
document.getElementById("verifyBtn").addEventListener("click", verifyAuthCode);

let emailVerified = false;

function sendAuthCode() {
  const email = document.getElementById("email").value;
  if (!email) {
    alert(t.alertEnterEmail);
    return;
  }

  fetch(`${API_BASE_URL}/auth-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then(res => {
      if (!res.ok) throw new Error();
      alert(t.alertSent);
      document.getElementById("authSection").style.display = "block";
    })
    .catch(() => alert(t.alertSendFail));
}

function verifyAuthCode() {
  const email = document.getElementById("email").value;
  const authCode = document.getElementById("authCode").value;

  fetch(`${API_BASE_URL}/auth-code/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, authCode }),
  })
    .then(res => {
      if (res.status === 200) {
        alert(t.alertSuccess);
        emailVerified = true;
        document.getElementById("submitBtn").disabled = false;
      } else {
        throw new Error();
      }
    })
    .catch(() => alert(t.alertCodeWrong));
}

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!emailVerified) {
    alert(t.alertNeedVerify);
    return;
  }

  const data = {
    loginId: document.getElementById("loginId").value,
    password: document.getElementById("password").value,
    country: document.getElementById("country").value,
  };

  fetch(`${API_BASE_URL}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include', // cookie
    body: JSON.stringify(data),
  })
    .then(res => {
      if (res.ok) {
        alert(t.alertJoinSuccess);
        location.reload();
      } else {
        throw new Error();
      }
    })
    .catch(() => alert(t.alertJoinFail));
});