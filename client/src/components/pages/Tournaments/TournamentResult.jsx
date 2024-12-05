import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./TournamentResult.module.css";
import axiosInstance from "src/axiosInstance";
import PropTypes from "prop-types";

export default function TournamentResult({ user, logoutHandler }) {
  const [resultData, setResultData] = useState({});
  const [userCoinsProfit, setUserCoinsProfit] = useState(0);
  const { tournamentId } = useParams();

  useEffect(() => {
    if (!tournamentId) return;
    if(!user) return;
    async function getResultData() {
      try {
        const response = await axiosInstance.get(
          `constract/getrosters/${tournamentId}`
        );
        const data = response.data;
        setResultData(data);

        const userData = data.find((item) => item.userId === user.id);
        if (userData) {
          setUserCoinsProfit(userData.profitCoins);
        }
      } catch (error) {
        console.error("Проблемы при загрузке данных турнира:", error);
      }
    }
    getResultData();
  }, [tournamentId, user]);

  // Выводем рейтинг и ростеры юзеров
  return (
    <>
      <h1>Результаты</h1>
      <div className={StyleSheet.results}>{userCoinsProfit}</div>
    </>
  );
}

// заберем все ростеры
// подгрузим всех плееров каждого ростера
// сделаем табличку и вывдеме красиво результаты и морды плееров с капитаном
// напишем какие призы выйграли плеере

TournamentResult.propTypes = {
  user: PropTypes.object,
  logoutHandler: PropTypes.func.isRequired,
};
