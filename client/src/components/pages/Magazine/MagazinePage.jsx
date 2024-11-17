import React from "react";
import styles from "src/components/pages/Magazine/MagazinePage.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import ShopCard from "src/components/ui/Cards/ShopCard";

export default function MagazinePage({ user, logoutHandler }) {
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
        className={styles.background}
        style={{ backgroundImage: `url(${fonImage})` }}
      >
        <div className={styles.wrapper}>
          <div className={styles.nav}>
            <NavigationComp user={user} logoutHandler={logoutHandler} />
          </div>
          <div className={styles.magazineNavigation}>
            <h1 className={styles.underline}>Контракты</h1>
            <h1>Аренда</h1>
            <h1>Разрешения</h1>
            <h1>Трансферы</h1>
          </div>
          <div className={styles.subNavigation}>
            <h2 className={styles.underline}>Спортсмены</h2>
            <h2>Тренеры</h2>
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
      </div>
    </>
  );
}
