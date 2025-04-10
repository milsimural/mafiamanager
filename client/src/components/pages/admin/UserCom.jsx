import React, { useState } from "react";
import PropTypes from "prop-types";
import axiosInstance from "src/axiosInstance";
import styles from "./UserCom.module.css";

export default function UserCom({ user }) {
  const [money, setMoney] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAddMoney = async () => {
    const amount = parseInt(money);

    if (isNaN(amount)) {
      setError("Пожалуйста, введите корректное целое число");
      return;
    }

    if (amount <= 0) {
      setError("Сумма должна быть положительным числом");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.post(`/admin/addmoney/${user.id}`, {
        money: amount,
      });
      setSuccess(true);
      setMoney("");
      // Можно добавить здесь обновление состояния пользователя, если нужно
    } catch (err) {
      setError(err.response?.data?.message || "Не удалось добавить деньги");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    // Разрешаем только целые числа
    const value = e.target.value.replace(/[^0-9]/g, "");
    setMoney(value);
    // Сбрасываем сообщения при изменении ввода
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  return (
    <div className={styles.user}>
      <div className={styles.userInfo}>
        <span>ID: &nbsp; {user.id}</span>
        <span>
          &nbsp; <b>{user.name}</b>
        </span>
        <span>Email: &nbsp; {user.email}</span>
        <span>
          Монеты: &nbsp; <b>{user.coins}</b>
        </span>
        <span>Кристаллы: &nbsp; {user.gems}</span>
        <input
          type="number"
          value={money}
          onChange={handleInputChange}
          placeholder="Введите сумму"
          min="1"
          step="1"
          disabled={isLoading}
          pattern="\d*"
        />

        <button onClick={handleAddMoney} disabled={isLoading || !money}>
          {isLoading ? "Обработка..." : "Добавить деньги"}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && (
        <div className={styles.success}>Деньги успешно добавлены!</div>
      )}
    </div>
  );
}

UserCom.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    coins: PropTypes.number.isRequired,
    gems: PropTypes.number.isRequired,
  }).isRequired,
};
