import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "src/components/pages/Account/TeamPage.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp";
import bigCoinImage from "src/components/files/big-coin20.png";
import ShopCard from "src/components/ui/Cards/ShopCard";
import axiosInstance from "src/axiosInstance";

export default function AccountPage({ user, logoutHandler }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamCost, setTeamCost] = useState(0);

  useEffect(() => {
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
                      <ShopCard player={teamMember.player} shop={false} />
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
