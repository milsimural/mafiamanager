import { useState } from "react";
import axiosInstance, { setAccessToken } from "../../../axiosInstance";
import styles from "src/components/pages/LoginPage/LoginPage.module.css";
import backgroundImage from "src/components/pages/LoginPage/fon-green-red-2x.png";

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
    <div
      className={styles.backgroundImage}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1>Войти</h1>
        </div>
        <form onSubmit={loginHandler} noValidate>
          <div className={styles.formGroup}>
            <div className={styles.forInputWrapper}>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.formInput}
                placeholder="Email*"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.formInput}
              placeholder="Пароль*"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
