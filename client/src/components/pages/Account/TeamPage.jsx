import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "src/components/pages/Account/TeamPage.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp2";
import bigCoinImage from "src/components/files/big-coin20.png";
import ShopCard from "src/components/ui/Cards/ShopCard2";
import axiosInstance from "src/axiosInstance";
import { formatNumberWithSpaces } from 'src/utils';

export default function TeamPage({ user, logoutHandler, updateUserCoins }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamCost, setTeamCost] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [playerToSell, setPlayerToSell] = useState(null);

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

  const handleClickOutside = (event) => {
    if (event.target.classList.contains(styles.overlay)) {
      setIsMenuOpen(false);
    }
  };


  const openSellMenu = (player) => {
    setPlayerToSell(player);
    setIsMenuOpen(true);
  };

  const closeSellMenu = () => {
    setIsMenuOpen(false);
    setPlayerToSell(null);
  }

  function calculateTeamCost(teamArray) {
    let cost = 0;
    teamArray.forEach((teamPlayer) => {
      cost += teamPlayer.player.costcoins;
    });
    setTeamCost(cost);
  }

  async function sellPlayer() {
    try {
      const response = await axiosInstance.get(
        `constract/checkPlayerInLiveRosters/${user.id}/${playerToSell.id}`
      );
      const result = response.data.result;

      if (result === true) {
        alert("Вы не можете продать игрока пока он участвует в турнирах");
        console.log("Вы не можете продать игрока пока он участвует в турнирах");
        return;
      }

      const sellResponse = await axiosInstance.post(
        `/players/sell/${playerToSell.id}/${user.id}`
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
    } finally {
      closeSellMenu();
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
              <BurgerMenuComp user={user}/>
            </div>
            <NavigationComp user={user} logoutHandler={logoutHandler} />
          </div>
          <h1>Команда</h1>
          <div className={styles.twoColomns}>
            <div className={styles.leftColumn}>
              <div className={styles.teamCost}>
                <div className={styles.teamCostText}>Стоимость команды</div>
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
                        openSellMenu={openSellMenu}
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
      {isMenuOpen && playerToSell && (
               <div className={styles.overlay} onClick={handleClickOutside}>
              <div className={styles.menu}>
                <h3>Внимание!</h3>
                <p>
                  Вы подтверждаете продажу игрока <b>{playerToSell.nickname}</b>?
                </p>
                <p>
                  Коммисия за продажу составит 2% —{" "}
                  {formatNumberWithSpaces(
                    Math.ceil((playerToSell.costcoins / 100) * 2)
                  )}{" "}
                  монет
                </p>
                <div className={styles.centerMode}>
                  <button
                    className={styles.menuButtonYes}
                    onClick={sellPlayer}
                  >
                    Да
                  </button>
                  <button className={styles.menuButtonNo} onClick={closeSellMenu}>
                    Нет
                  </button>
                </div>
              </div>
            </div>
          )}
    </>
  );
}

TeamPage.propTypes = {
  user: PropTypes.object,
  logoutHandler: PropTypes.func.isRequired,
  updateUserCoins: PropTypes.func.isRequired,
};
