import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axiosInstance, { setAccessToken } from "../../axiosInstance";

export default function RegistrationPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const registrationHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/registration", formData);
      setUser(res.data.user);
      setAccessToken(res.data.accessToken);
    } catch (error) {
      if (error.response) {
        console.error("Ошибка ответа сервера:", error.response.data);
      } else if (error.request) {
        console.error("Сервер не ответил:", error.request);
      } else {
        console.error("Ошибка при настройке запроса:", error.message);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <form onSubmit={registrationHandler} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Логин"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
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
          <TextField
            margin="normal"
            required
            fullWidth
            label="Повторите пароль"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Зарегистрироваться
          </Button>
        </form>
      </Box>
    </Container>
  );
}
