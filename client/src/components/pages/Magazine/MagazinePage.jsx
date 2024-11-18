import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "src/components/pages/Magazine/MagazinePage.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import ShopCard from "src/components/ui/Cards/ShopCard";
import axiosInstance from "src/axiosInstance";

export default function MagazinePage({ user, logoutHandler }) {
  const [players, setPlayers] = useState([]);

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

  return (
    <>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${fonImage})` }}
      >
        <div className={styles.wrapper}>
          <div className={styles.nav}>
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
            {players.map((player) => (
              <div className={styles.playerWrapper} key={player.nickname}>
                <div className={styles.player}>
                  <ShopCard player={player} shop={true} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

MagazinePage.propTypes = {
  user: PropTypes.object.isRequired,
  logoutHandler: PropTypes.func.isRequired,
};