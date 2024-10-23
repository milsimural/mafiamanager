import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Layout from "./components/Layout";
import RegistrationPage from "./components/pages/RegistrationPage";
import LoginPage from "./components/pages/LoginPage";

function App() {
  const [user, setUser] = useState();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout user={user}/>,
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
          element: <LoginPage setUser={setUser} />
        }
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
