import React from "react";
import NavigationComp from "./ui/NavigationComp";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return <div>Layout
    <NavigationComp />
    <Outlet />
  </div>;
}
