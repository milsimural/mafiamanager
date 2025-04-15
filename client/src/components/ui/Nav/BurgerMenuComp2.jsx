import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./BurgerMenuComp2.module.css"; // Подключите CSS-модуль

export default function BurgerMenuComp2({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Функция для открытия/закрытия меню
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Закрытие меню при клике вне его области
  const handleClickOutside = (event) => {
    if (event.target.classList.contains(styles.overlay)) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div>
      {/* Кнопка для открытия меню */}
      <button onClick={toggleMenu} className={styles.menuButton}>
        Открыть меню
      </button>

      {/* Затемнение и меню */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={handleClickOutside}>
          <div className={styles.menu}>
            {/* Кнопка закрытия меню */}
            <button onClick={toggleMenu} className={styles.closeButton}>
              ×
            </button>

            {/* Пункты меню */}
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
              <li>
                <Link className={styles.menuItem} to="/items">
                  Предметы
                </Link>
              </li>

              {user?.isAdmin && (
                <>
                  <li>==============</li>
                  <li>
                    <Link className={styles.menuItem} to="/playersmanagment">
                      Управление спортсменами
                    </Link>
                  </li>
                  <li>
                    <Link className={styles.menuItem} to="/users">
                      Управление пользователями
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
