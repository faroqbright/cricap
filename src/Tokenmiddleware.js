import { getToken, getRefreshToken, setToken } from "@/utils/getTokenCookie";
import axios from "axios";

const BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "https://ws.stage.cricap.com/api"
    : "https://ws.cricap.com/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.log("No refresh token found");
      return null;
    }

    console.log("🔄 Attempting token refresh...");

    const response = await axios.post(
      `${BASE_URL}/auth/token/refresh`,
      {},
      {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      console.log("✅ Token refresh successful:", response.data);
    }

    if (response?.data?.jwt) {
      setToken(response.data.jwt, response.data.refreshToken);
      return response.data.jwt;
    }

    console.log("⚠️ Token refresh response missing JWT.");
    return null;
  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    return null;
  }
};

apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ API Request Successful:", response.config.url, response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();
      if (!newAccessToken) {
        console.log("❌ Token refresh failed, rejecting request.");
        return Promise.reject(error);
      }

      console.log("🔄 Retrying request with new token:", newAccessToken);
      setToken(newAccessToken); // ✅ Save new token
      apiClient.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    }

    console.error("❌ API Request Failed:", error.config.url, error);
    return Promise.reject(error);
  }
);

export { BASE_URL, apiClient };
