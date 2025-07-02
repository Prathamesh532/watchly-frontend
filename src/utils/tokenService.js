// Enhanced tokenService.js
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_REFRESH_THRESHOLD = 300; // 5 minutes in seconds
const MAX_REFRESH_RETRIES = 3;
const REFRESH_RETRY_KEY = "refresh_retry_count";

export const tokenService = {
  // Token storage methods
  getAccessToken: () => {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  getRefreshToken: () => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  setTokens: (accessToken, refreshToken) => {
    try {
      if (accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      }
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      // Reset retry count on successful token set
      localStorage.removeItem(REFRESH_RETRY_KEY);
    } catch (error) {
      console.error("Error setting tokens:", error);
      throw new Error("Failed to store authentication tokens");
    }
  },

  clearTokens: () => {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_RETRY_KEY);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },

  // Token validation methods
  isTokenExpired: (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp <= currentTime;
    } catch (error) {
      console.error("Error parsing token:", error);
      return true;
    }
  },

  isTokenExpiringSoon: (token, threshold = TOKEN_REFRESH_THRESHOLD) => {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp - currentTime <= threshold;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return false;
    }
  },

  getTokenPayload: (token) => {
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Error getting token payload:", error);
      return null;
    }
  },

  // Retry mechanism for refresh token
  getRefreshRetryCount: () => {
    try {
      const count = localStorage.getItem(REFRESH_RETRY_KEY);
      return count ? parseInt(count, 10) : 0;
    } catch {
      return 0;
    }
  },

  incrementRefreshRetry: () => {
    try {
      const currentCount = tokenService.getRefreshRetryCount();
      localStorage.setItem(REFRESH_RETRY_KEY, (currentCount + 1).toString());
      return currentCount + 1;
    } catch {
      return MAX_REFRESH_RETRIES;
    }
  },

  resetRefreshRetries: () => {
    try {
      localStorage.removeItem(REFRESH_RETRY_KEY);
    } catch (error) {
      console.error("Error resetting refresh retries:", error);
    }
  },

  hasExceededRefreshRetries: () => {
    return tokenService.getRefreshRetryCount() >= MAX_REFRESH_RETRIES;
  },

  // Security methods
  validateTokenStructure: (token) => {
    if (!token || typeof token !== "string") return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    try {
      // Validate each part can be decoded
      atob(parts[0]); // header
      atob(parts[1]); // payload
      return true;
    } catch {
      return false;
    }
  },

  // Check if tokens exist and are valid
  hasValidTokens: () => {
    const accessToken = tokenService.getAccessToken();
    const refreshToken = tokenService.getRefreshToken();

    return (
      tokenService.validateTokenStructure(accessToken) &&
      tokenService.validateTokenStructure(refreshToken) &&
      !tokenService.isTokenExpired(refreshToken)
    );
  },

  // Session persistence methods (for page refresh)
  persistTokensToSession: () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (accessToken) sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error("Error persisting tokens to session:", error);
    }
  },

  restoreTokensFromSession: () => {
    try {
      const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);

      if (accessToken && refreshToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }

      // Clean up session storage
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error restoring tokens from session:", error);
    }
  },

  // Utility methods
  getTokenTimeRemaining: (token) => {
    const payload = tokenService.getTokenPayload(token);
    if (!payload) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - currentTime);
  },

  formatTokenExpiry: (token) => {
    const payload = tokenService.getTokenPayload(token);
    if (!payload) return "Invalid token";

    return new Date(payload.exp * 1000).toLocaleString();
  },
};
