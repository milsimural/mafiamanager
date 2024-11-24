import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "src/components/pages/Magazine/MagazinePage.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp";
import ShopCard from "src/components/ui/Cards/ShopCard";
import axiosInstance from "src/axiosInstance";

export default function MagazinePage({ user, logoutHandler, updateUserCoins }) {
  const [players, setPlayers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/players")
      .then((res) => {
        setPlayers(res.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении списка игроков:", error);
      });
  }, []);

  useEffect(() => {
    if (user && user.id) {
      axiosInstance
        .get(`/players/myteam/${user.id}`)
        .then((res) => {
          setTeamMembers(res.data);
        })
        .catch((error) => {
          console.error("Ошибка при получении списка игроков команды:", error);
        });
    }
  }, [user]);

  function buyPlayer(playerId, userId) {
    axiosInstance
      .post(`/players/buy/${playerId}/${userId}`)
      .then((res) => {
        console.log(res.data);
        updateUserCoins(res.data);
      })
      .catch((error) => {
        const errorMessage =
          error.response && error.response.data
            ? error.response.data
            : error.message;

        alert(`Произошла ошибка при покупке игрока. ${errorMessage}`);
        console.error("Ошибка при покупке игрока:", error);
      });
  }

  return (
    <>
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
          <div className={styles.magazineNavigation}>
            <h1 className={styles.underline}>Контракты</h1>
            <h1>Аренда</h1>
            <h1>Разрешения</h1>
            <h1>Трансферы</h1>
          </div>
          <div className={styles.subNavigation}>
            <h2 className={styles.underline}>Спортсмены</h2>
            <h2>Тренеры</h2>
          </div>
          <div className={styles.players}>
            {players.map((player) => {
              // Проверяем, входит ли player.id в teamMembers
              const isInTeam = teamMembers.some(
                (member) => member.playerid === player.id
              );
              console.log(isInTeam);

              return (
                <div className={styles.playerWrapper} key={player.nickname}>
                  <div className={styles.player}>
                    <ShopCard
                      user={user}
                      player={player}
                      shop={true}
                      buyPlayer={buyPlayer}
                      isInTeam={isInTeam} // Передаем проп isInTeam
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

MagazinePage.propTypes = {
  user: PropTypes.object,
  logoutHandler: PropTypes.func.isRequired,
};
