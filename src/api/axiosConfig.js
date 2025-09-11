
import axios from 'axios';

const API_BASE_URL = "https://hanyahunya.com/gitremind/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupAuthInterceptor = (handleSessionExpired) => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if the request should be retried
      const status = error.response?.status;
      // 401(Unauthorized) 또는 403(Forbidden)일 때 재발급 시도
      const isAuthError = status === 401 || status === 403;
      const isRefreshRequest = originalRequest.url === '/refreshAccessToken';
      
      // _retry 플래그로 이미 재시도된 요청인지 확인
      if (isAuthError && !isRefreshRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
          .then(() => apiClient(originalRequest))
          .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true; // 재시도 플래그 설정
        isRefreshing = true;

        try {
          await apiClient.post('/refreshAccessToken');
          processQueue(null);
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          console.error("세션이 만료되어 로그아웃합니다.", refreshError);
          handleSessionExpired(); // 세션 만료 처리 함수 호출
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;