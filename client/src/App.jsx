import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/pages/HomePage/HomePage";
import Layout from "./components/Layout";
import RegistrationPage from "./components/pages/Auth/RegistrationPage";
import LoginPage from "./components/pages/Auth/LoginPage";
import axiosInstance from "./axiosInstance";
import { setAccessToken } from "./axiosInstance";
import UsersPage from "./components/pages/admin/UsersPage";
import TournamentsPage from "./components/pages/TournamentsPage";
import AccountPage from "./components/pages/Account/TeamPage";
import MagazinePage from "./components/pages/Magazine/MagazinePage";

function App() {
  const [user, setUser] = useState();

  const logoutHandler = async () => {
    await axiosInstance.get("/auth/logout");
    setUser(null);
    setAccessToken("");
  };

  useEffect(() => {
    axiosInstance("/tokens/refresh")
      .then((res) => {
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
      })
      .catch(() => setUser(null));
  }, []);

  

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout user={user} logoutHandler={logoutHandler} />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/registration",
          element: <RegistrationPage setUser={setUser} />,
        },
        {
          path: "/login",
          element: <LoginPage setUser={setUser} />,
        },
        {
          path: "/users",
          element: <UsersPage />,
        },
        {
          path: "/tournaments",
          element: <TournamentsPage />,
        },
        {
          path: "/account",
          element: <AccountPage user={user} logoutHandler={logoutHandler} />,
        },
        {
          path: "/magazine",
          element: <MagazinePage user={user} logoutHandler={logoutHandler} />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
