import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "src/components/pages/Account/TeamPage.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import bigCoinImage from "src/components/files/big-coin20.png";
import ShopCard from "src/components/ui/Cards/ShopCard";
import axiosInstance from "src/axiosInstance";

export default function AccountPage({ user, logoutHandler }) {
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
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${fonImage})` }}
      >
        <div className={styles.wrapper}>
          <div className={styles.nav}>
            <NavigationComp user={user} logoutHandler={logoutHandler} />
          </div>
          <h1>AccountPage</h1>
          <div className={styles.twoColomns}>
            <div className={styles.leftColumn}>
              <div className={styles.teamCost}>
                <div>Стоимость команды</div>
                <img src={bigCoinImage} alt="coin" width="20" height="20" />
                <div className={styles.white}> 12000</div>
              </div>
              <div className={styles.players}>
                {players.map((player) => (
                  <div className={styles.playerWrapper} key={player.nickname}>
                    <div className={styles.player}>
                      <ShopCard player={player} shop={false} />
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

AccountPage.propTypes = {
  user: PropTypes.object.isRequired,
  logoutHandler: PropTypes.func.isRequired,
};
