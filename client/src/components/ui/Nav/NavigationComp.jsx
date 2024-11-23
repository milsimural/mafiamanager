import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "src/components/ui/Nav/NavigationComp.module.css";
import gemsImage from "src/components/ui/Nav/gems.png";
import coinsImage from "src/components/ui/Nav/coins.png";
import userImage from "src/components/ui/Nav/user.png";

export default function NavigationComp({ user, logoutHandler }) {
  return (
    <nav>
      {user && (
        <>
          <div className={styles.coins}>
            <img src={coinsImage} alt="coins" />
            <div>{user.coins}</div>
          </div>
          <div className={styles.gems}>
            <img src={gemsImage} alt="gems" />
            <div>{user.gems}</div>
          </div>
        </>
      )}

      <div className={styles.user}>
        <img src={userImage} alt="user" />
        <div>
          {user ? (
            <>
              {user?.name}, <span className={styles.spacer}></span>
              <a href="#" onClick={logoutHandler} className={styles.link}>
                Выйти
              </a>
            </>
          ) : (
            <>
              <Link to="/registration" className={styles.link}>
                Регистрация
              </Link>
              , <span className={styles.spacer}></span>
              <Link to="/login" className={styles.link}>
                Вход
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

NavigationComp.propTypes = {
  user: PropTypes.object,
  logoutHandler: PropTypes.func.isRequired,
};
