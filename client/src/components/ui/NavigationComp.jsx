import React from "react";
import { Link } from "react-router-dom";

export default function NavigationComp({ user, logoutHandler }) {
  return (
    <nav className="navigation">
      <p>Навигация</p>
      <p>Здравствуйте {user ? user.name : "Пользователь не передан"}</p>
      <Link to="/">Home</Link>
      <br />
      <Link to="/registration">Регистрация</Link>
      <br />
      <Link to="/login">Войти</Link>
      <br />
      {user && (
        <button onClick={logoutHandler} style={{ cursor: "pointer" }}>
          Выйти
        </button>
      )}
    </nav>
  );
}
