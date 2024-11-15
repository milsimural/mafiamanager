import PropTypes from "prop-types";
import NavigationComp from "./ui/Nav/NavigationComp";
import { Outlet } from "react-router-dom";

export default function Layout({ user, logoutHandler }) {
  return (
    <>
      {/* <NavigationComp user={user} logoutHandler={logoutHandler} /> */}
      <Outlet />
    </>
  );
}

Layout.propTypes = {
  user: PropTypes.object.isRequired,
  logoutHandler: PropTypes.func.isRequired,
};
