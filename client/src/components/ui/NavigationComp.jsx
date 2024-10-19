import React from "react";
import { Link } from "react-router-dom";

export default function NavigationComp() {
  return (
    <nav className="navigation">
      <p>NavigationCom</p>
      <Link to="/">Home</Link>
      <br />
      <Link to="/notes">Notes</Link>
    </nav>
  );
}
