import React from "react";
import NavigationComp from "./ui/NavigationComp";
import { Outlet } from "react-router-dom";

export default function Layout({ user }) {
  return (
    <div>
      Layout
      <NavigationComp user={user} />
      <Outlet />
    </div>
  );
}
