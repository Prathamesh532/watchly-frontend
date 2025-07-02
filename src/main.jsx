import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import Signup from "./pages/Signup.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./store/configStore.js";
import { PersistGate } from "redux-persist/es/integration/react";
import UserProfile from "./pages/UserProfile.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";
import HomePage from "./pages/HomePage.jsx";
import Tweets from "./pages/Tweets.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <Signup /> },
      { path: "profile", element: <UserProfile /> },
      { path: "video/:_id", element: <VideoPlayer /> },
      { path: "tweets", element: <Tweets /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
  // </StrictMode>
);
