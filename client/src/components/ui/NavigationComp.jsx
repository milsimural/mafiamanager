import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Container, Toolbar, Typography, Button } from "@mui/material";

export default function NavigationComp({ user, logoutHandler }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Здравствуйте, {user ? user.name : "Пользователь не передан"}
        </Typography>

        <Link
          to="/"
          style={{ textDecoration: "none", color: "inherit", marginLeft: 16 }}
        >
          <Button color="inherit">Home</Button>
        </Link>

        <Link
          to="/users"
          style={{ textDecoration: "none", color: "inherit", marginLeft: 16 }}
        >
          <Button color="inherit">Users</Button>
        </Link>

        <Link
          to="/account"
          style={{ textDecoration: "none", color: "inherit", marginLeft: 16 }}
        >
          <Button color="inherit">Акаунт</Button>
        </Link>

        <Link
          to="/tournaments"
          style={{ textDecoration: "none", color: "inherit", marginLeft: 16 }}
        >
          <Button color="inherit">Турниры</Button>
        </Link>

        <Link
          to="/registration"
          style={{ textDecoration: "none", color: "inherit", marginLeft: 16 }}
        >
          <Button color="inherit">Регистрация</Button>
        </Link>

        {!user && <Link
          to="/login"
          style={{ textDecoration: "none", color: "inherit", marginLeft: 16 }}
        >
          <Button color="inherit">Войти</Button>
        </Link>}

        {user && (
          <Button
            onClick={logoutHandler}
            color="inherit"
            style={{ textTransform: "none", marginLeft: 16 }}
          >
            Выйти
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
