import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "src/components/pages/Account/TeamPage.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp";
import bigCoinImage from "src/components/files/big-coin20.png";
import ShopCard from "src/components/ui/Cards/ShopCard";
import axiosInstance from "src/axiosInstance";

export default function TeamPage({ user, logoutHandler, updateUserCoins }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamCost, setTeamCost] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!user) return;
    axiosInstance
      .get(`/players/myteam/${user?.id}`)
      .then((res) => {
        setTeamMembers(res.data);
        calculateTeamCost(res.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении списка игроков:", error);
      });
  }, [user]);

  function calculateTeamCost(teamArray) {
    let cost = 0;
    teamArray.forEach((teamPlayer) => {
      cost += teamPlayer.player.costcoins;
    });
    setTeamCost(cost);
  }

  async function sellPlayer(playerId, userId) {
    try {
      const response = await axiosInstance.get(
        `constract/checkPlayerInLiveRosters/${userId}/${playerId}`
      );
      const result = response.data.result;

      if (result === true) {
        alert("Вы не можете продать игрока пока он участвует в турнирах");
        console.log("Вы не можете продать игрока пока он участвует в турнирах");
        return;
      }

      const sellResponse = await axiosInstance.post(
        `/players/sell/${playerId}/${userId}`
      );
      console.log(sellResponse.data);
      updateUserCoins(sellResponse.data);
      alert(`Вы продали игрока`);
    } catch (error) {
      let errorMessage;

      if (error.response) {
        errorMessage = error.response.data
          ? error.response.data.message || error.response.data
          : "Неизвестная ошибка";
      } else {
        errorMessage = error.message;
      }

      alert(`Произошла ошибка при продаже игрока. ${errorMessage}`);
      console.error("Ошибка при продаже игрока:", error);
    }
  }

  return (
    <>
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${fonImage})` }}
      >
        <div className={styles.wrapper}>
          <div className={styles.nav}>
            <div className={styles.burger}>
              <BurgerMenuComp />
            </div>
            <NavigationComp user={user} logoutHandler={logoutHandler} />
          </div>
          <h1>Команда</h1>
          <div className={styles.twoColomns}>
            <div className={styles.leftColumn}>
              <div className={styles.teamCost}>
                <div>Стоимость команды</div>
                <img src={bigCoinImage} alt="coin" width="20" height="20" />
                <div className={styles.white}> {teamCost}</div>
              </div>
              <div className={styles.players}>
                {teamMembers.map((teamMember) => (
                  <div
                    className={styles.playerWrapper}
                    key={teamMember.player.nickname}
                  >
                    <div className={styles.player}>
                      <ShopCard
                        user={user}
                        player={teamMember.player}
                        shop={false}
                        sellPlayer={sellPlayer}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.rightColumn}></div>
          </div>
        </div>
      </div>
    </>
  );
}

TeamPage.propTypes = {
  user: PropTypes.object,
  logoutHandler: PropTypes.func.isRequired,
  updateUserCoins: PropTypes.func.isRequired,
};
