import React, { useState } from "react";
import axios from "axios";

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

  const registrationHandler = async (event, formData) => {
    event.preventDefault();
    try {
      const res = await axios.post("/api/auth/registration", formData);
      setUser(res.data.user);
    } catch (error) {
      if (error.response) {
        console.error("Ошибка ответа сервера:", error.response.data);
        alert("Произошла ошибка: " + error.response.data.message);
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
    <div>
      <h1>Регистрация</h1>
      <form onSubmit={(e) => registrationHandler(e, formData)}>
        <label htmlFor="name">Введите login</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="email">Введите email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Введите password</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor="confirmPassword">Повторите password</label>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}
