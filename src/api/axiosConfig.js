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

      if (error.response?.status === 403 && originalRequest.url !== '/refreshAccessToken' && !originalRequest._retry) {
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
