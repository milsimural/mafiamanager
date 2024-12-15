import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./TournamentResult.module.css";
import axiosInstance from "src/axiosInstance";
import PropTypes from "prop-types";

export default function TournamentResult({ user, logoutHandler }) {
  const [resultData, setResultData] = useState({});
  const [userCoinsProfit, setUserCoinsProfit] = useState(0);
  const [userRosterId, setUserRosterId] = useState(null);
  const [userIsTakeProfit, setUserIsTakeProfit] = useState(false);
  const { tournamentId } = useParams();

  useEffect(() => {
    if (!tournamentId) return;
    if (!user) return;

    async function getResultData() {
      try {
        const response = await axiosInstance.get(
          `constract/getrosters/${tournamentId}`
        );
        const data = response.data;

        // Сортируем данные по "place"
        const sortedData = data.sort((a, b) => a.place - b.place);

        setResultData(sortedData);
        console.log(sortedData);

        const userData = sortedData.find((item) => item.userId === user.id);
        if (userData) {
          setUserCoinsProfit(userData.profitCoins);
          setUserRosterId(userData.id);
          setUserIsTakeProfit(userData.isTakeProfit);
        }
      } catch (error) {
        console.error("Проблемы при загрузке данных турнира:", error);
      }
    }

    getResultData();
  }, [tournamentId, user]);

  async function takeProfit() {
    if (userIsTakeProfit) return;
    try {
      const response = await axiosInstance.patch(
        `constract/takeProfit/${userRosterId}`
      );
      console.log(response.data);
      alert("Приз успешно забран");
      setUserIsTakeProfit(true);
    } catch (error) {
      console.error(error);
    }
  }

  // Выводем рейтинг и ростеры юзеров
  return (
    <>
      <h1>Результаты</h1>
      <div>Мой доход:</div>
      <div className={StyleSheet.results}>{userCoinsProfit}</div>
      <div>userRosterId: {userRosterId}</div>
      <div>
        {userIsTakeProfit ? (
          <>Вы забрали приз</>
        ) : (
          <>
            <br />
            <button onClick={takeProfit}>Забрать приз</button>
            <br />
            <br />
          </>
        )}
      </div>
      <div>
        <table>
          <tbody>
            <tr>
              <td>Место</td>
              <td>Ник</td>
              <td>Монеты</td>
              <td>Состав</td>
            </tr>
            {resultData && resultData.length > 0 ? (
              resultData.map((item) => (
                <tr
                  key={item.id}
                  className={
                    item.userId === user.id ? styles.highlight : styles.normal
                  }
                >
                  <td>{item.place}</td>
                  <td>{item.userName}</td>
                  <td>{item.profitCoins}</td>
                  <td>
                    {item.players.map((player) => player.nickname).join(", ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
