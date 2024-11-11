import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axiosInstance, { setAccessToken } from "../../axiosInstance";

export default function LoginPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      setUser(res.data.user);
      setAccessToken(res.data.accessToken);
    } catch (error) {
      if (error.response) {
        console.error("Ошибка ответа сервера:", error.response.data);
        alert(
          "Ошибка при входе: " +
            (error.response.data.text || "Неизвестная ошибка сервера.")
        );
      } else if (error.request) {
        console.error("Сервер не ответил:", error.request);
        alert("Сервер не отвечает. Пожалуйста, попробуйте позже.");
      } else {
        console.error("Ошибка при настройке запроса:", error.message);
        alert("Произошла ошибка: " + error.message);
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Войти
        </Typography>
        <form onSubmit={loginHandler} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
        </form>
      </Box>
    </Container>
  );
}
