import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "src/components/pages/Account/AccountPage.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";

export default function AccountPage({ user, logoutHandler }) {
  return (
    <>
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${fonImage})` }}
      >
        <NavigationComp user={user} logoutHandler={logoutHandler} />
        <h1>AccountPage</h1>
      </div>
    </>
  );
}

AccountPage.propTypes = {
  user: PropTypes.object.isRequired,
  logoutHandler: PropTypes.func.isRequired,
};
