import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./PersonalCard.module.css";
import ShopCard2 from "src/components/ui/Cards/ShopCard2";
import axiosInstance from "src/axiosInstance";
import offImage from "src/components/pages/Tournaments/off.png";

export default function PersonalCard({
  player,
  user,
  updateUserCoins,
  numberEl,
}) {
  const [isInTeam, setIsInTeam] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Закрытие меню при клике вне его области
  const handleClickOutside = (event) => {
    if (event.target.classList.contains(styles.overlay)) {
      setIsMenuOpen(false);
    }
  };

  function buyPlayer(playerId, userId, playercostcoins) {
    if (user.coins < playercostcoins) {
      alert("Недостаточно монет");
      return;
    }
    axiosInstance
      .post(`/players/buy/${playerId}/${userId}`)
      .then((res) => {
        console.log(res.data);
        updateUserCoins(res.data);
        setIsInTeam(true);
        alert("Успешно куплен");
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
    <div className={styles.playersListElementNone} onClick={toggleMenu}>
      <div className={styles.num}>
        {/* {String(startNumber + index).padStart(2, "0")} */}
        {numberEl}
      </div>
      <div className={styles.nickname}>{player.nickname}</div>
      <div className={styles.sign}>
        <img src={offImage} alt="Status" />
      </div>
      {isMenuOpen && (
        <div className={styles.overlay} onClick={handleClickOutside}>
          <div className={styles.centerdiv}>
            <ShopCard2
              user={user}
              player={player}
              shop={true}
              buyPlayer={buyPlayer}
              isInTeam={isInTeam} // Передаем проп isInTeam
            />
          </div>
        </div>
      )}
    </div>
  );
}

PersonalCard.propTypes = {
  player: PropTypes.object,
  user: PropTypes.object,
  updateUserCoins: PropTypes.func,
  index: PropTypes.number,
  numberEl: PropTypes.number,
};
