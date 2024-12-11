import { useState, useEffect } from "react";
import axiosInstance, { setAccessToken } from "../../../axiosInstance";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "src/components/pages/Auth/LoginPage.module.css";
import backgroundImage from "src/components/pages/Auth/fon-green-red-2x.png";
import buttonImage from "src/components/pages/Auth/button-login.png";
import loginImage from "src/components/pages/Auth/login.png";

export default function RegistrationPage({ user, setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    gomafiaId: "",
  });
  const [allowRegistration, setAllowRegistration] = useState(false);

  useEffect(() => {
    setAllowRegistration(
      formData.email.length > 0 &&
        formData.name.length > 0 &&
        formData.password.length > 0 &&
        formData.confirmPassword.length > 0
    );
  }, [formData]);

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
      alert("Регистрация прошла успешно");
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
    <div
      className={styles.backgroundImage}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1>Регистрация</h1>
        </div>
        <form onSubmit={registrationHandler} noValidate>
          <div className={styles.formGroup}>
            <input
              required
              placeholder="Никнейм*"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              required
              placeholder="Email*"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              placeholder="Ваш Id на gomafia.pro - если есть"
              name="gomafiaId"
              type="number"
              value={formData.gomafiaId}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              required
              placeholder="Пароль*"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              required
              placeholder="Повторите пароль*"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.register}>
            <div>
              <Link to="/login">Логин</Link>
            </div>
            <Link to="/login">
              <img src={loginImage} alt="login" />
            </Link>
          </div>
          <button
            type="submit"
            style={{ backgroundImage: `url(${buttonImage})` }}
            className={styles.submitButton}
            disabled={!allowRegistration}
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}

RegistrationPage.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired,
};
