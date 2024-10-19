import { useState } from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Layout from "./components/Layout";
import NotesPage from "./components/pages/NotesPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/notes",
          element: <NotesPage />,
        },
      ],
    },
  ]);
  return (
    <>
      <HomePage />
    </>
  );
}

export default App;
