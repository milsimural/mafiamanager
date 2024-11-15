import { useState, useEffect } from "react";
import axiosInstance, { setAccessToken } from "../../../axiosInstance";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "src/components/pages/Auth/LoginPage.module.css";
import backgroundImage from "src/components/pages/Auth/fon-green-red-2x.png";
import buttonImage from "src/components/pages/Auth/button-login.png";
import regImage from "src/components/pages/Auth/reg.png";

export default function LoginPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [allowLogin, setAllowLogin] = useState(false);

  useEffect(() => {
    setAllowLogin(formData.email.length > 0 && formData.password.length > 0);
  }, [formData]);

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
          <div className={styles.register}>
            <div>
              <Link to="/registration">Регистрация</Link>
            </div>
            <Link to="/registration">
              <img src={regImage} alt="registration" />
            </Link>
          </div>
          <button
            type="submit"
            style={{ backgroundImage: `url(${buttonImage})` }}
            className={styles.submitButton}
            disabled={!allowLogin}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  setUser: PropTypes.func.isRequired,
};
