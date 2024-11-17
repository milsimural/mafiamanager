import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "src/components/pages/Account/TeamPage.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import bigCoinImage from "src/components/files/big-coin20.png";
import ShopCard from "src/components/ui/Cards/ShopCard";

export default function AccountPage({ user, logoutHandler }) {
  const players = [
    {
      stars: 1,
      nickname: "Растишка",
      power: 30,
      clubId: 1,
    },
    {
      stars: 2,
      nickname: "Пельмень",
      power: 20,
      clubId: 1,
    },
    {
      stars: 3,
      nickname: "Капуст",
      power: 70,
      clubId: 1,
    },
    {
      stars: 4,
      nickname: "Куст",
      power: 90,
      clubId: 1,
    },
    {
      stars: 5,
      nickname: "Побег",
      power: 90,
      clubId: 1,
    },
    {
      stars: 1,
      nickname: "Растишка",
      power: 30,
      clubId: 1,
    },
    {
      stars: 2,
      nickname: "Пельмень",
      power: 20,
      clubId: 1,
    },
    {
      stars: 3,
      nickname: "Капуст",
      power: 70,
      clubId: 1,
    },
    {
      stars: 4,
      nickname: "Куст",
      power: 90,
      clubId: 1,
    },
    {
      stars: 5,
      nickname: "Побег",
      power: 90,
      clubId: 1,
    },
    {
      stars: 1,
      nickname: "Растишка",
      power: 30,
      clubId: 1,
    },
    {
      stars: 2,
      nickname: "Пельмень",
      power: 20,
      clubId: 1,
    },
    {
      stars: 3,
      nickname: "Капуст",
      power: 70,
      clubId: 1,
    },
    {
      stars: 4,
      nickname: "Куст",
      power: 90,
      clubId: 1,
    },
    {
      stars: 5,
      nickname: "Побег",
      power: 90,
      clubId: 1,
    },
  ];

  return (
    <>
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${fonImage})` }}
      >
        <div className={styles.wrapper}>
          <div className={styles.nav}>
            <NavigationComp user={user} logoutHandler={logoutHandler} />
          </div>
          <h1>AccountPage</h1>
          <div className={styles.twoColomns}>
            <div className={styles.leftColumn}>
              <div className={styles.teamCost}>
                <div>Стоимость команды</div>
                <img src={bigCoinImage} alt="coin" width="20" height="20" />
                <div className={styles.white}> 12000</div>
              </div>
              <div className={styles.players}>
                {players.map((player) => (
                  <div className={styles.playerWrapper} key={player.nickname}>
                    <div className={styles.player}>
                      <ShopCard player={player} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.rightColumn}></div>
          </div>
        </div>
      </div>
    </>
  );
}

AccountPage.propTypes = {
  user: PropTypes.object.isRequired,
  logoutHandler: PropTypes.func.isRequired,
};
