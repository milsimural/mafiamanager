import React from "react";
import PropTypes from "prop-types";
import styles from "src/components/ui/Stars/StarsComp.module.css";
import starImage from "src/components/ui/Stars/star.svg";
import emptystarImage from "src/components/ui/Stars/emptystar.svg";
import s1 from "src/components/ui/Stars/1s.svg";
import s2 from "src/components/ui/Stars/2s.svg";
import s3 from "src/components/ui/Stars/3s.svg";
import s4 from "src/components/ui/Stars/4s.svg";
import s5 from "src/components/ui/Stars/5s.svg";

export default function StarsComp2({ stars }) {
  function displayStars(count) {
    if (!count)
      return (
        <div className={styles.starsContainer}>
          <img src={emptystarImage} alt="" />
          <img src={emptystarImage} alt="" />
          <img src={emptystarImage} alt="" />
          <img src={emptystarImage} alt="" />
          <img src={emptystarImage} alt="" />
        </div>
      );

    switch (count) {
      case 1:
        return (
          <div className={styles.starsContainer}>
            <img src={s1} alt="" style={{ width: "38px", height: "7px" }} />
          </div>
        );
      case 2:
        return (
          <div className={styles.starsContainer}>
            <img src={s2} alt="" style={{ width: "38px", height: "7px" }} />
          </div>
        );
      case 3:
        return (
          <div className={styles.starsContainer}>
            <img src={s3} alt="" style={{ width: "38px", height: "7px" }} />
          </div>
        );
      case 4:
        return (
          <div className={styles.starsContainer}>
            <img src={s4} alt="" style={{ width: "38px", height: "7px" }} />
          </div>
        );
      case 5:
        return (
          <div className={styles.starsContainer}>
            <img src={s5} alt="" style={{ width: "38px", height: "7px" }} />
          </div>
        );
    }
  }

  return <div className={styles.starsContainer}>{displayStars(stars)}</div>;
}

StarsComp2.propTypes = {
  stars: PropTypes.number,
};
