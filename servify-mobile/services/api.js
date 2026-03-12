import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const getBaseUrl = () => {
  const debuggerHost =
    Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    return `http://${host}:3000/api/v1`;
  }
};

const BASE_URL = getBaseUrl();
console.log("API Base URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("token");
    }
    return Promise.reject(error);
  }
);

export default api;