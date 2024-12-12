import React from "react";
import PropTypes from "prop-types";
import basicCaptainImage from "src/components/ui/PlayerBars/captainBasic.png";
import styles from "src/components/ui/PlayerBars/CaptainBarComp.module.css";

export default function CaptainBarComp({ captain, removeCaptainFromRoster }) {
  if (captain === null || captain === undefined) return <div className={styles.none}>Нет капитана</div>;

  return (
    <div
      className={styles.captain}
      onClick={() => removeCaptainFromRoster()}
    >
      <div className={styles.captainWrapper}>
        <div className={styles.captainNum}>1</div>
        <div className={styles.captainName}>{captain?.nickname}</div>
      </div>
      <div className={styles.captainRole}>Капитан</div>
      <div className={styles.captainFotoCont}>
        <img src={basicCaptainImage} alt="" />
      </div>
    </div>
  );
}

CaptainBarComp.propTypes = {
  captain: PropTypes.object,
  removeCaptainFromRoster: PropTypes.func,
};
