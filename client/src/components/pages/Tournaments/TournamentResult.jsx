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
import bigGemsImage from "src/components/files/gems.svg";
import takeImg from "src/components/pages/Tournaments/take.png";
import TopUserResultComp from "./TopUserResultComp"

export default function TournamentResult({ user, logoutHandler }) {
  const [resultData, setResultData] = useState({});
  const [topData, setTopData] = useState([]);
  const [userCoinsProfit, setUserCoinsProfit] = useState(0);
  const [userGemsProfit, setUserGemsProfit] = useState(0);
  const [userItemsProfit, setUserItemsProfit] = useState([]);
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
      let itemsList;
      try {
        const response = await axiosInstance.get(
          `constract/getrosters/${tournamentId}`
        );
        const data = response.data;

        // Сортируем данные по "place"
        const sortedData = data.sort((a, b) => a.place - b.place);

        setResultData(sortedData);

        const top = sortedData.filter((item) => item.profitCoins !== 0);
        setTopData(top);

        const userData = sortedData.find((item) => item.userId === user.id);
        if (userData) {
          setUserCoinsProfit(userData.profitCoins);
          setUserGemsProfit(userData.profitGems);
          itemsList = userData.profitItems;
          setUserRosterId(userData.id);
          setUserIsTakeProfit(userData.isTakeProfit);
        }

        const itemsObjects = await axiosInstance.post(`items/itemsList/`, {itemsList: itemsList});
        setUserItemsProfit(itemsObjects.data);

      } catch (error) {
        console.error("Проблемы при загрузке данных турнира:", error);
      }
    }

    getResultData();
  }, [tournamentId, user]);

  async function getUserGiftItems(userId) {
    if (!topData) return;
    try {
    const tempData = topData.find((item) => item.userId === userId);
    const userData = structuredClone(tempData);
    const userObject = {};
    userObject.coins = 0;
    userObject.gems = userData.profitGems;
    userObject.items = userData.profitItems;
    userObject.tournamentId = userData.tournamentId;
    userObject.place = userData.place;
    const itemsObjects = await axiosInstance.post(`items/itemsList/`, {itemsList: userObject.items});
    userObject.ItemsView = itemsObjects;
    // console.log(userObject);
    return userObject;
     } catch(e) {
      console.log(`error: ${e} - при парсинге данных для победителей`)
      return;
     }
  }

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
    if(!userItemsProfit) return;
    try {
      const response = await axiosInstance.patch(
        `constract/takeProfit/${userRosterId}`
      );
      
      const itArray = userItemsProfit.map((item) => {
        return item.id
      })

      const itemsResponse = await axiosInstance.post(`/items/add-multiple/${user.id}`, {
        itemIds: itArray
      });
      console.log('Успешно создано предметов:', itemsResponse.data.count);
      console.log('ID созданных экземпляров:', itemsResponse.data.items);
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
            <div className={styles.results}>{userCoinsProfit !== undefined ? userCoinsProfit : "Загрузка..."}</div>
            <div className={styles.gems}>
              {userGemsProfit !== undefined ? <img src={bigGemsImage} alt="gem" /> : ""}
              </div>
            <div className={styles.results}>{userGemsProfit !== undefined ? userGemsProfit : ""}</div>
            <div className={styles.items}>
            <div className={styles.itemsExample}>
              {Array.isArray(userItemsProfit) ? (
                  userItemsProfit.map((item, index) => (
                  <div key={index}>{item.picture ? <img src={`/${item.picture}`} alt={item.type} /> : item.id}</div>
                  ))
                ) : (
                <div></div>
                )}
            </div>
              </div>
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
                    Забрать
                  </button>
                ) : (
                  <p>Призы еще не готовы к выдаче</p>
                )}

                <br />
                <br />
              </>
            )}
          </div>

            {topData && topData.length > 0 ? (
              <div>
              <h2 className={styles.h2top}>Призы</h2>
              <div className={styles.top}>
  {topData.map((item, index) => (
    <div className={styles.topItems} key={item.id}>
      {/* Место - разные стили для 1-3 позиций */}
      <div className={`
        ${styles.topItemPlace} 
        ${index === 0 ? styles.gold : ''}
        ${index === 1 ? styles.silver : ''}
        ${index === 2 ? styles.bronze : ''}
      `}>
        {item.place}
      </div>
      
      {/* Имя - тоже можно стилизовать */}
      <div className={`
        ${styles.topItemName} 
        ${index === 0 ? styles.goldText : ''}
        ${index === 1 ? styles.silverText : ''}
        ${index === 2 ? styles.bronzeText : ''}
      `}>
        {item.userName}
      </div>
      
      <div>
        <TopUserResultComp getItemFunc={getUserGiftItems} userId={item.userId} />
      </div>
    </div>
  ))}
</div>
            </div>
            ) : (<p>Призовой фонд не распределяется так как участников турнира Мафеменеджера менее 20 человек.</p>)}
          

          <div>
            <h2>Турнирная таблица</h2>
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
