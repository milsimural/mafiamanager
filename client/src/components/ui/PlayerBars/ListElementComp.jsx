import PropTypes from "prop-types";
import { useState } from "react";
import onImage from "src/components/pages/Tournaments/on.png";
import styles from "src/components/ui/PlayerBars/ListElementComp.module.css";

export default function ListElementComp({
  index,
  player,
  addPlayerToRoster,
  addCaptainToRoster,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  function addCaptain(playerId) {
    addCaptainToRoster(playerId);
    setMenuOpen(false);
  }

  function addPlayer(playerId) {
    addPlayerToRoster(playerId);
    setMenuOpen(false);
  }

  function menuHandler() {
    return (
      <div className={styles.playersListMenu}>
        <button onClick={() => addCaptain(player.id)}>Заявить капитаном</button>
        <button onClick={() => addPlayer(player.id)}>Заявить игроком</button>
        <button onClick={() => setMenuOpen(false)}>Закрыть</button>
      </div>
    );
  }

  function standarView() {
    return (
      <div
        className={styles.playersListElement}
        onClick={() => setMenuOpen(true)}
      >
        <div className={styles.num}>{String(index + 1).padStart(2, "0")}</div>
        <div className={styles.nickname}>{player.nickname}</div>
        <div className={styles.sign}>
          <img src={onImage} alt="Status" />
        </div>
      </div>
    );
  }

  if (menuOpen) {
    return menuHandler();
  } else {
    return standarView();
  }
}

ListElementComp.propTypes = {
  key: PropTypes.number,
  index: PropTypes.number,
  player: PropTypes.object,
  addPlayerToRoster: PropTypes.func,
  addCaptainToRoster: PropTypes.func,
};
