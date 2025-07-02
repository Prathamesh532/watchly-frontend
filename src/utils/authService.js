// authService.js
import { tokenService } from "./tokenService";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

export const authService = {
  // Login method
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Invalid response: missing tokens");
      }

      // Validate token structure before storing
      if (
        !tokenService.validateTokenStructure(data.accessToken) ||
        !tokenService.validateTokenStructure(data.refreshToken)
      ) {
        throw new Error("Invalid token format received");
      }

      // Store tokens
      tokenService.setTokens(data.accessToken, data.refreshToken);

      return {
        success: true,
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Logout method
  logout: async () => {
    try {
      const refreshToken = tokenService.getRefreshToken();

      // Call logout endpoint to invalidate tokens on server
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenService.getAccessToken()}`,
          },
          body: JSON.stringify({ refreshToken }),
        }).catch((error) => {
          // Don't throw error if logout endpoint fails
          console.warn("Server logout failed:", error);
        });
      }
    } finally {
      // Always clear local tokens regardless of server response
      tokenService.clearTokens();
    }
  },

  // Refresh token method
  refreshToken: async () => {
    try {
      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      if (tokenService.isTokenExpired(refreshToken)) {
        throw new Error("Refresh token expired");
      }

      if (tokenService.hasExceededRefreshRetries()) {
        throw new Error("Maximum refresh attempts exceeded");
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        tokenService.incrementRefreshRetry();
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.accessToken) {
        throw new Error("Invalid refresh response: missing access token");
      }

      // Validate new token structure
      if (!tokenService.validateTokenStructure(data.accessToken)) {
        throw new Error("Invalid access token format received");
      }

      // Update tokens (refresh token might also be rotated)
      const newRefreshToken = data.refreshToken || refreshToken;
      tokenService.setTokens(data.accessToken, newRefreshToken);

      return {
        accessToken: data.accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  },

  // Register method
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      // Some APIs return tokens on registration, others require separate login
      if (data.accessToken && data.refreshToken) {
        tokenService.setTokens(data.accessToken, data.refreshToken);
      }

      return {
        success: true,
        user: data.user,
        requiresLogin: !data.accessToken,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Verify token method
  verifyToken: async () => {
    try {
      const accessToken = tokenService.getAccessToken();

      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  },

  // Get current user method
  getCurrentUser: async () => {
    try {
      const accessToken = tokenService.getAccessToken();

      if (!accessToken || tokenService.isTokenExpired(accessToken)) {
        return null;
      }

      return await authService.verifyToken();
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },
};
