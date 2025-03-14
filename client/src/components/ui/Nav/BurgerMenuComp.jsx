import React from "react";
import { Link } from "react-router-dom";
import styles from "src/components/ui/Nav/BurgerMenuComp.module.css";

export default function BurgerMenuComp() {
  return (
    <div className={styles.menu}>
      <input
        type="checkbox"
        id="burgerCheckbox"
        className={styles.burgerCheckbox}
      />
      <label htmlFor="burgerCheckbox" className={styles.burger}></label>
      <ul className={styles.menuList}>
        <li>
          <Link className={styles.menuItem} to="/">
            Главная
          </Link>
        </li>
        <li>
          <Link className={styles.menuItem} to="/team">
            Команда
          </Link>
        </li>
        <li>
          <Link className={styles.menuItem} to="/magazine">
            Контракты
          </Link>
        </li>
        <li>
          <Link className={styles.menuItem} to="/tournaments">
            Турниры
          </Link>
        </li>
        <li>
          <Link className={styles.menuItem} to="/rating">
            Рейтинг
          </Link>
        </li>
      </ul>
    </div>
  );
}
