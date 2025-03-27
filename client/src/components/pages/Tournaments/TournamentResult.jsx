import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./TournamentResult.module.css";
import axiosInstance from "src/axiosInstance";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function TournamentResult({ user, logoutHandler }) {
  const [resultData, setResultData] = useState({});
  const [userCoinsProfit, setUserCoinsProfit] = useState(0);
  const [userRosterId, setUserRosterId] = useState(null);
  const [userIsTakeProfit, setUserIsTakeProfit] = useState(false);
  const { tournamentId } = useParams();
  const [leaders, setLeaders] = useState([]);
  const [sum, setSum] = useState(0);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!tournamentId) return;
    if (!user) return;

    async function TourInfo() {
      try {
        const response = await axiosInstance.get(`constract/getroster/${user.id}/${tournamentId}`);
        const data = response.data;
        if (data.isOver) setIsOver(true);
      } catch (error) {
        console.log(error);
      }
    }

    TourInfo();
  }, [tournamentId, user])

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

  useEffect(() => {
    if (!user) return;
    if (!tournamentId) return;

    async function getLeaders() {
      try {
        const leadersRaw = await axiosInstance.get(
          `players/getRosresPlayersArrayWithSum/${tournamentId}`
        );

        // Сортировка массива по свойству count от большего к меньшему
        const sortedLeaders = leadersRaw.data.sort((a, b) => b.count - a.count);

        setLeaders(sortedLeaders);
      } catch (error) {
        console.error(error);
      }
    }

    getLeaders();
  }, [tournamentId, user]);

  useEffect(() => {
    if (!leaders.length) return;
    let sumPlayers = 0;
    for (let i = 0; i < leaders.length; i++) {
      sumPlayers += leaders[i].count;
    }
    setSum(sumPlayers);
  }, [leaders]);

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
      <Link to="/tournaments">Назад</Link>
      <div>Мой доход:</div>
      <div className={StyleSheet.results}>{userCoinsProfit}</div>
      <div>userRosterId: {userRosterId}</div>
      <div>
        {userIsTakeProfit ? (
          <>Вы забрали приз</>
        ) : (
          <>
            <br />
            {isOver ? (<button onClick={takeProfit}>Забрать приз</button>) : (<p>Призы еще не готовы к выдаче</p>)}
            
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
      <div>
        <h2>Больше всего в командах:</h2>
        <table>
          <tbody>
            <tr>
              <td>Ник</td>
              <td>Ростеры</td>
              <td>Sum</td>
            </tr>
            {leaders?.map((leader) => {
              return (
                <tr key={leader.value}>
                  <td>{leader.nickname}</td>
                  <td>{leader.count}</td>
                  <td>
                    <div
                      className={styles.procent}
                      style={{ width: sum ? (leader.count / sum) * 100 : 0 }}
                    ></div>
                  </td>
                </tr>
              );
            })}
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
