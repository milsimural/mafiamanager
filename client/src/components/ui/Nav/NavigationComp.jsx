import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "src/components/ui/Nav/NavigationComp.module.css";
import gemsImage from "src/components/ui/Nav/gems.png";
import coinsImage from "src/components/ui/Nav/coins.png";
import userImage from "src/components/ui/Nav/user.png";

export default function NavigationComp({ user, logoutHandler }) {
  return (
    <nav>
      <div className={styles.coins}>
        <img src={coinsImage} alt="coins" />
        <div>12000</div>
      </div>
      <div className={styles.gems}>
        <img src={gemsImage} alt="gems" />
        <div>100</div>
      </div>
      <div className={styles.user}>
        <img src={userImage} alt="user" />
        <div>{user ? user?.name : "User"}</div>
      </div>
    </nav>
  );
}

NavigationComp.propTypes = {
  user: PropTypes.object.isRequired,
  logoutHandler: PropTypes.func.isRequired,
};
