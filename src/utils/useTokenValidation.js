import { useEffect, useState } from "react";
import { tokenService } from "./tokenService";

export const useTokenValidation = () => {
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const validateTokens = () => {
      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();

      console.log("tokenService accessToken", accessToken);
      console.log("tokenService refreshToken", refreshToken);
      

      // Check if tokens exist
      if (!accessToken || !refreshToken) {
        setIsTokenValid(false);
        setShouldRefresh(false);
        return;
      }

      // Check refresh token validity
      const isRefreshTokenValid = !tokenService.isTokenExpired(refreshToken);

      // Check access token status
      const isAccessTokenExpired = tokenService.isTokenExpired(accessToken);
      const isAccessTokenExpiringSoon =
        tokenService.isTokenExpiringSoon(accessToken);

      setIsTokenValid(!isAccessTokenExpired && isRefreshTokenValid);
      setShouldRefresh(isAccessTokenExpiringSoon && isRefreshTokenValid);
    };

    // Initial validation
    validateTokens();

    // Set up periodic checks
    const intervalId = setInterval(validateTokens, 60000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  return { isTokenValid, shouldRefresh };
};
