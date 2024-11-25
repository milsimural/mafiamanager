import React from "react";
import PropTypes from "prop-types";
import frameImage from "src/components/ui/PlayerBars/frame.png";
import basicFoto from "src/components/ui/PlayerBars/basic.png";
import StarsComp from "src/components/ui/Stars/StarsComp";
import styles from "src/components/ui/PlayerBars/ShortPlayerBarComp.module.css";

export default function ShortPlayerBarComp({ num }) {
  const stars = 3;

  return (
    <div className={styles.teamElementWrapper}>
      <div className={styles.slotNum}>{num ? num : 0}</div>
      <div className={styles.teamListElement}>
        <div className={styles.square}>
          <img src={basicFoto} className={styles.image} alt="Image" />
          <div
            className={styles.frame}
            style={{ backgroundImage: `url(${frameImage})` }}
          ></div>
        </div>
        <div className={styles.playerInfoContainer}>
          <div className={styles.stars}>
            <StarsComp stars={stars} />
          </div>
          <div className={styles.picName}>Градиент</div>
        </div>
      </div>
    </div>
  );
}

ShortPlayerBarComp.propTypes = {
  num: PropTypes.number,
};
