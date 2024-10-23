import React from "react";
import { Link } from "react-router-dom";

export default function NavigationComp({ user }) {
  return (
    <nav className="navigation">
      <p>Навигация</p>
      <p>Здравствуйте {user?.name}</p>
      <Link to="/">Home</Link>
      <br />
      <Link to="/registration">Регистрация</Link>
      <br />
      <Link to="/login">Войти</Link>
    </nav>
  );
}
