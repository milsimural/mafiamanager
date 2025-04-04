import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./TournamentResult.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import axiosInstance from "src/axiosInstance";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp2";
import classNames from "classnames";
import bigCoinImage from "src/components/files/big-coin20.png";
import takeImg from "src/components/pages/Tournaments/take.png";

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
        const response = await axiosInstance.get(
          `constract/getroster/${user.id}/${tournamentId}`
        );
        const data = response.data;
        if (data.isOver) setIsOver(true);
      } catch (error) {
        console.log(error);
      }
    }

    TourInfo();
  }, [tournamentId, user]);

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
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${fonImage})` }}
      >
        <div className={styles.wrapper}>
          <div className={styles.nav}>
            <div className={styles.burger}>
              <BurgerMenuComp user={user} />
            </div>
            <NavigationComp user={user} logoutHandler={logoutHandler} />
          </div>
          <h1>Результаты</h1>
          <div className={styles.resultRow}>
            <h2 className={styles.thin}>Доход:</h2>
            <div className={styles.coins}>
              <img src={bigCoinImage} alt="coin" />
            </div>
            <div className={styles.results}>{userCoinsProfit}</div>
          </div>

          <div>
            {userIsTakeProfit ? (
              <>Вы забрали приз</>
            ) : (
              <>
                <br />
                {isOver ? (
                  <button
                    style={{ backgroundImage: `url(${takeImg})` }}
                    className={styles.takeButton}
                    onClick={takeProfit}
                  >
                    Забрать приз
                  </button>
                ) : (
                  <p>Призы еще не готовы к выдаче</p>
                )}

                <br />
                <br />
              </>
            )}
          </div>
          <div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.headerCell}>Место</th>
                  <th className={styles.headerCell}>Ник</th>
                  <th className={styles.headerCell}>Монеты</th>
                  <th className={styles.headerCell}>Состав</th>
                </tr>
              </thead>
              <tbody>
                {resultData && resultData.length > 0 ? (
                  resultData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={classNames({
                        [styles.highlight]: item.userId === user.id,
                        [styles.normal]: item.userId !== user.id,
                        [styles.alternateRow]: index % 2 === 0,
                      })}
                    >
                      <td className={`${styles.cell} ${styles.centerText}`}>
                        {item.place}
                      </td>
                      <td className={styles.cell}>{item.userName}</td>
                      <td className={styles.cell}>{item.profitCoins}</td>
                      <td className={styles.cell}>
                        {item.players
                          .map((player) => player.nickname)
                          .join(", ")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Данные загружаются...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.leaders}>
            <h2 style={{marginTop : "40px"}}>Фавориты:</h2>
            <div className={styles.leadersGrid}>
              {leaders?.map((leader) => (
                <div key={leader.value} className={styles.leaderCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.nickname}>{leader.nickname}</span>
                    <span className={styles.count}>{leader.count}</span>
                  </div>
                  <div className={styles.progressContainer}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: sum ? `${(leader.count / sum) * 100}%` : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
