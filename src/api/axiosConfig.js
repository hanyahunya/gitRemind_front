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
      // [추가] 요청 config에서 skipAuthRefresh 플래그를 확인합니다.
      const { skipAuthRefresh } = originalRequest;

      // [수정] !skipAuthRefresh 조건을 추가합니다.
      // 이 플래그가 true이면, 토큰 재발급 로직을 실행하지 않고 바로 에러를 반환합니다.
      if (!skipAuthRefresh && error.response?.status === 403 && originalRequest.url !== '/refreshAccessToken' && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
          .then(() => apiClient(originalRequest))
          .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await apiClient.post('/refreshAccessToken');
          processQueue(null);
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          console.error("세션이 만료되어 로그아웃합니다.", refreshError);
          handleSessionExpired();
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