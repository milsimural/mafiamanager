import React, { useState } from "react";
import axios from "axios";

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

  const loginHandler = async (event, formData) => {
    event.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", formData);
      setUser(res.data.user);
    } catch (error) {
      if (error.response) {
        console.error("Ошибка ответа сервера:", error.response.data);
        alert(
          "Ошибка при входе: " + error.response.data.message ||
            "Неизвестная ошибка сервера."
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
    <div>
      <h1>Войти</h1>
      <form onSubmit={(e) => loginHandler(e, formData)}>
        <label htmlFor="email">Введите email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Введите пароль</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}
