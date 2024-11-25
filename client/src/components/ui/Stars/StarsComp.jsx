import React from "react";
import PropTypes from "prop-types";
import styles from "src/components/ui/Stars/StarsComp.module.css";
import starImage from "src/components/ui/Stars/star.svg";
import emptystarImage from "src/components/ui/Stars/emptystar.svg";

export default function StarsComp({ stars }) {
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
            <img src={starImage} alt="" />
            <img src={emptystarImage} alt="" />
            <img src={emptystarImage} alt="" />
            <img src={emptystarImage} alt="" />
            <img src={emptystarImage} alt="" />
          </div>
        );
      case 2:
        return (
          <div className={styles.starsContainer}>
            <img src={starImage} alt="" />
            <img src={starImage} alt="" />
            <img src={emptystarImage} alt="" />
            <img src={emptystarImage} alt="" />
            <img src={emptystarImage} alt="" />
          </div>
        );
      case 3:
        return (
          <div className={styles.starsContainer}>
            <img src={starImage} alt="" />
            <img src={starImage} alt="" />
            <img src={starImage} alt="" />
            <img src={emptystarImage} alt="" />
            <img src={emptystarImage} alt="" />
          </div>
        );
      case 4:
        return (
          <div className={styles.starsContainer}>
            <img src={starImage} alt="" />
            <img src={starImage} alt="" />
            <img src={starImage} alt="" />
            <img src={emptystarImage} alt="" />
          </div>
        );
      case 5:
        return (
          <div className={styles.starsContainer}>
            <img src={starImage} alt="" />
            <img src={starImage} alt="" />
            <img src={starImage} alt="" />
            <img src={starImage} alt="" />
            <img src={starImage} alt="" />
          </div>
        );
    }
  }

  return <div className={styles.starsContainer}>{displayStars(stars)}</div>;
}

StarsComp.propTypes = {
  stars: PropTypes.number,
};
