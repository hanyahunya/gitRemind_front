import axios from 'axios';

// 서버의 기본 URL 주소
const API_BASE_URL = "https://hanyahunya.com/gitremind/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 모든 요청에 쿠키를 포함시키는 설정
});

export default apiClient;