import React from "react";
import PropTypes from "prop-types";
import frameImage from "src/components/ui/PlayerBars/frame.png";
import basicFoto from "src/components/ui/PlayerBars/basic.png";
import StarsComp from "src/components/ui/Stars/StarsComp";
import styles from "src/components/ui/PlayerBars/ShortPlayerBarComp.module.css";

export default function ShortPlayerBarComp({ num, player, remover }) {
  return (
    <div
      className={styles.teamElementWrapper}
      onClick={() => remover(player.id)}
    >
      <div className={styles.slotNum}>{num ? num : 0}</div>
      <div className={styles.teamListElement}>
        {/* <div className={styles.square}>
          <img src={basicFoto} className={styles.image} alt="Image" />
          <div
            className={styles.frame}
            style={{ backgroundImage: `url(${frameImage})` }}
          ></div>
        </div> */}
        <div className={styles.playerInfoContainer}>
          <div className={styles.stars}>
            <StarsComp stars={player.stars} />
          </div>
          <div className={styles.picName}>{player.nickname}</div>
        </div>
      </div>
    </div>
  );
}

ShortPlayerBarComp.propTypes = {
  num: PropTypes.number,
  key: PropTypes.number,
  player: PropTypes.object,
  remover: PropTypes.func,
};
