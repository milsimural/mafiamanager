import classNames from "classnames";
import PropTypes, { element } from "prop-types";
import styles from "src/components/ui/Cards/Cards2.module.css";

import russiaImage from "src/components/ui/Cards/countries/russiaFlagRound.svg";
import StarsComponent from "src/components/ui/Cards/StarsComponent/StarsComponent";
import powerImage from "src/components/ui/Cards/energy.svg";

import faceGold from "src/components/ui/Cards/goldFace.svg";
import faceGreen from "src/components/ui/Cards/greenFace.svg";
import faceBlue from "src/components/ui/Cards/blueFace.svg";
import faceViolet from "src/components/ui/Cards/violetFace.svg";
import faceGray from "src/components/ui/Cards/grayFace.svg";

import buyImage from "src/components/ui/Cards/buy2x.png";
import closeBuyImage from "src/components/ui/Cards/close2x.png";
import coinsImage from "src/components/ui/Nav/coins.png";

export default function ShopCard2({
  user,
  player,
  shop,
  buyPlayer,
  isInTeam,
  sellPlayer,
}) {
  const getColorByStars = (stars) => {
    switch (stars) {
      case 1:
        return "gray";
      case 2:
        return "green";
      case 3:
        return "blue";
      case 4:
        return "violet";
      case 5:
        return "gold";
      default:
        return "gray";
    }
  };

  const color = getColorByStars(player.stars);

  const elementImages = {
    gray: faceGray,
    green: faceGreen,
    blue: faceBlue,
    violet: faceViolet,
    gold: faceGold,
  };

  return (
    <>
      <div
        className={styles.face}
        style={{ backgroundImage: `url(${elementImages[color]})` }}
      >
        <div className={styles.space10}></div>
        <div
          className={styles.fotoCont}
          style={{
            backgroundImage: `url(${player.picture})`,
          }}
        >
          <div className={styles.infoCont}>
            <div className={styles.flag}>
              <img src={russiaImage} />
            </div>
            <div className={styles.powerCont}>
              <div className={styles.powerText}>{player.power}</div>
              <div className={styles.energy}>
                <img src={powerImage} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.name}>{player.nickname}</div>
        <div className={styles.stars}>
          <StarsComponent stars={player.stars} />
        </div>
        <div
          className={styles.shield}
        >
          <img src={`titan.png`} />
        </div>
      </div>

      {shop && (
        <div className={styles.buy}>
          {!isInTeam ? (
            <button
              onClick={() => buyPlayer(player.id, user.id, player.costcoins)}
              style={{
                backgroundImage: `url(${buyImage})`,
                backgroundSize: "cover",
              }}
            >
              <img
                src={coinsImage}
                alt={`${player.nickname}: ${player.costcoins}`}
              />
              <div className={styles.buttonText}>{player.costcoins}</div>
            </button>
          ) : (
            <button
              style={{
                backgroundImage: `url(${closeBuyImage})`,
                backgroundSize: "cover",
              }}
            >
              <img
                src={coinsImage}
                alt={`${player.nickname}: ${player.costcoins}`}
              />
              <div className={styles.buttonText}>{player.costcoins}</div>
            </button>
          )}
        </div>
      )}

      {!shop && (
        <div className={styles.buy}>
          <button
            onClick={() => sellPlayer(player.id, user.id)}
            style={{
              backgroundColor: "black", // Черный фон
              width: "144px",
              border: "none", // Убирает границу
              color: "white", // Цвет текста
              cursor: "pointer", // Указатель при наведении
              display: "flex", // Для выравнивания содержимого
              alignItems: "center", // Вертикальное выравнивание
              justifyContent: "center", // Горизонтальное выравнивание
              padding: "10px", // Отступы (по желанию)
              borderRadius: "5px", // Закругленные углы (по желанию)
            }}
          >
            <div style={{ paddingRight: "10px" }}>Продать:</div>
            <img
              src={coinsImage}
              alt={`${player.nickname}: ${player.costcoins}`}
              style={{ marginTop: "12px" }}
            />
            <div className={styles.buttonText} style={{ marginTop: "12px" }}>
              {player.costcoins}
            </div>
          </button>
        </div>
      )}
    </>
  );
}

ShopCard2.propTypes = {
  user: PropTypes.object,
  player: PropTypes.object,
  shop: PropTypes.bool,
  buyPlayer: PropTypes.func,
  isInTeam: PropTypes.bool,
  sellPlayer: PropTypes.func,
};
