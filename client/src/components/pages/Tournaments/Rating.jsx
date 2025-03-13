import React, { useState, useEffect } from "react";
import axiosInstance from "src/axiosInstance";
import styles from "./Rating.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp2";

export default function Rating({ user, logoutHandler }) {
  const [rating, setRating] = useState([]);
  const [error, setError] = useState(null);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axiosInstance.get("/constract/rating");
        setRating(res.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
      }
    };

    fetchRating();
  }, []);

  useEffect(() => {
   const fetchSeasons = async () => {
    try {
      const res = await axiosInstance.get("/seasons");
      setSeasons(res.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  fetchSeasons();
  console.log(seasons);

  }, [])

  return (
    <div
          className={styles.background}
          style={{ backgroundImage: `url(${fonImage})` }}
        >
          <div className={styles.wrapper}>
            <div className={styles.nav}>
              <div className={styles.burger}>
                <BurgerMenuComp />
              </div>
              <NavigationComp user={user} logoutHandler={logoutHandler} />
            </div>
      <h1>Рейтинг</h1>
      {error && <div className={styles.error}>{error}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headerCell}>Место</th>
            <th className={styles.headerCell}>Ник</th>
            <th className={styles.headerCell}>Монеты</th>
          </tr>
        </thead>
        <tbody>
          {rating.length > 0 ? (
            rating.map((item, index) => (
              <tr
                key={item.id} // Используйте уникальный идентификатор
                className={index % 2 === 0 ? styles.alternateRow : undefined}
              >
                <td className={`${styles.cell} ${styles.centerText}`}>
                  {index + 1}
                </td>
                <td className={styles.cell}>{item.userName}</td>
                <td className={styles.cell}>{item.totalProfit}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className={styles.cell}>
                Данные загружаются...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}