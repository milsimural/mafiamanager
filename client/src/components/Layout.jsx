import PropTypes from "prop-types";
import NavigationComp from "./ui/Nav/NavigationComp";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}
