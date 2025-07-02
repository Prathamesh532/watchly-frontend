import "./App.css";
import { Suspense, lazy, useState } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateAccessToken, userLogout } from "./store/userDux";
import { useTokenValidation } from "./utils/useTokenValidation";
import { tokenService } from "./utils/tokenService";
import { setCustomLoading } from "./store/commonDux";
import LISideBarTag from "./components/common/LISideBarTag";
import { SideBarTags } from "./utils/config";

function App() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  const { isTokenValid, shouldRefresh, refreshToken } = useTokenValidation();

  const handleRefreshToken = async () => {
    try {
      dispatch(setCustomLoading(true));
      dispatch(updateAccessToken(refreshToken)).then((res) => {
        if (res.type.includes("fulfilled")) {
          tokenService.resetRefreshRetries();
          console.log("Token refreshed successfully");
        } else throw new Error("Token refresh failed");
      });
    } catch (error) {
      console.error("Token refresh error:", error);
    } finally {
      dispatch(setCustomLoading(false));
    }
  };

  useEffect(() => {
    if (!isTokenValid) {
      console.log("Token is invalid, forcing logout");
      dispatch(userLogout());
      navigate("/login");
    } else if (shouldRefresh) {
      console.log("Token needs refresh");
      handleRefreshToken();
    }
  }, [isTokenValid, shouldRefresh, dispatch, navigate, refreshToken]);

  // Show loader during route changes
  // useEffect(() => {
  //   setIsPageLoading(true);

  //   const timeout = setTimeout(() => {
  //     if (isMounted.current) {
  //       setIsPageLoading(false);
  //     }
  //   }, 3000); // 3 seconds

  //   return () => clearTimeout(timeout);
  // }, [pathname]);

  return (
    <>
      {pathname !== "/login" && pathname !== "/signup" && <Navbar />}
      <ToastContainer position="top-right" autoClose={2000} />
      <LISideBarTag menuItems={SideBarTags} />
      {/* {isPageLoading && <LoadingSpinner />} */}
      <LoadingSpinner />
      <div
        className={`pl-0  ${
          pathname === "/login" || pathname === "/signup"
            ? "p-0"
            : "pt-4 sm:pl-[250px]"
        }`}
      >
        <Outlet />
      </div>
    </>
  );
}

export default App;
