import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/pages/HomePage/HomePage";
import Layout from "./components/Layout";
import RegistrationPage from "./components/pages/Auth/RegistrationPage";
import LoginPage from "./components/pages/Auth/LoginPage";
import axiosInstance from "./axiosInstance";
import { setAccessToken } from "./axiosInstance";
import UsersPage from "./components/pages/admin/UsersPage";
import TournamentsPage from "./components/pages/Tournaments/TournamentsPage";
import TournamentPage from "./components/pages/Tournaments/TournamentPage";
import TeamPage from "./components/pages/Account/TeamPage";
import MagazinePage from "./components/pages/Magazine/MagazinePage";
import TournamentResult from "./components/pages/Tournaments/TournamentResult";
import Rating from "./components/pages/Tournaments/Rating";
import MainPage from "./components/pages/Main/MainPage";

// Импорт контекста
import {UtilsProvider} from './context'

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

  function updateUserCoins(coins) {
    const updatedUser = { ...user, coins: coins };
    setUser(updatedUser);
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout user={user} logoutHandler={logoutHandler} />,
      children: [
        {
          path: "/",
          element: <MainPage user={user} logoutHandler={logoutHandler} />,
        },
        {
          path: "/registration",
          element: <RegistrationPage user={user} setUser={setUser} />,
        },
        {
          path: "/login",
          element: <LoginPage user={user} setUser={setUser} />,
        },
        {
          path: "/users",
          element: <UsersPage />,
        },
        {
          path: "/tournaments",
          element: (
            <TournamentsPage user={user} logoutHandler={logoutHandler} />
          ),
        },
        {
          path: "/tournaments/:tournamentId",
          element: <TournamentPage user={user} logoutHandler={logoutHandler} />,
        },
        {
          path: "/tournaments/:tournamentId/result",
          element: (
            <TournamentResult user={user} logoutHandler={logoutHandler} />
          ),
        },
        {
          path: "/team",
          element: (
            <TeamPage
              user={user}
              logoutHandler={logoutHandler}
              updateUserCoins={updateUserCoins}
            />
          ),
        },
        {
          path: "/magazine",
          element: (
            <MagazinePage
              user={user}
              logoutHandler={logoutHandler}
              updateUserCoins={updateUserCoins}
            />
          ),
        },
        {
          path: "/rating",
          element: <Rating user={user} logoutHandler={logoutHandler} />,
        },
        {
          path: "*",
          element: <div>404</div>,
        },
      ],
    },
  ]);
  return <UtilsProvider><RouterProvider router={router} /></UtilsProvider>;
}

export default App;
