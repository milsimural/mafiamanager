import React from "react";
import classNames from "classnames";
import styles from "src/components/ui/Cards/Cards.module.css";

import grayBlurImagePng from "src/components/ui/Cards/gray-blur.png";
import greenBlurImagePng from "src/components/ui/Cards/green-blur.png";
import blueBlurImagePng from "src/components/ui/Cards/blue-blur.png";
import violetBlurImagePng from "src/components/ui/Cards/violet-blur.png";
import goldBlurImagePng from "src/components/ui/Cards/gold-blur.png";

import testImage from "src/components/ui/Cards/test.png";
import grayElementImage from "src/components/ui/Cards/gray-element.png";
import greenElementImage from "src/components/ui/Cards/green-element.png";
import blueElementImage from "src/components/ui/Cards/blue-element.png";
import violetElementImage from "src/components/ui/Cards/violet-element.png";
import goldElementImage from "src/components/ui/Cards/gold-element.png";

import russiaImage from "src/components/ui/Cards/countries/russia.png";
import StarsComponent from "src/components/ui/Cards/StarsComponent/StarsComponent";
import powerImage from "src/components/ui/Cards/power.svg";

export default function ShopCard({ player }) {
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

  const getCountryImageById = (Id) => {
    switch (Id) {
      case 1:
        return russiaImage;
      default:
        return russiaImage;
    }
  };

  const countryImage = getCountryImageById(player.countryId);

  const color = getColorByStars(player.stars);

  const elementImages = {
    gray: grayElementImage,
    green: greenElementImage,
    blue: blueElementImage,
    violet: violetElementImage,
    gold: goldElementImage,
  };

  const blurImages = {
    gray: grayBlurImagePng,
    green: greenBlurImagePng,
    blue: blueBlurImagePng,
    violet: violetBlurImagePng,
    gold: goldBlurImagePng,
  };

  const elementImage = elementImages[color];
  const blurImage = blurImages[color];

  const clubName = "red elvis";

  return (
    <div className={classNames(styles.shopCard, styles[color])}>
      <div
        className={classNames(styles[`${color}Background`])}
        style={{ backgroundImage: `url(${blurImage})` }}
      >
        <div className={styles.foto}>
          <img src={testImage} alt={player.name} />
        </div>
        <div className={classNames(styles[`${color}Info`])}></div>
        <div
          className={`${styles.element} ${styles[`element${color}`]}`}
          style={{ backgroundImage: `url(${elementImage})` }}
        ></div>
        <div className={classNames(styles.sign, styles[`${color}Sign`])}>
          <img src={countryImage} alt={player.countryId} />
          <div className={styles.clubName}>{clubName}</div>
        </div>
        <div className={styles.stars}>
          <StarsComponent stars={player.stars} />
        </div>
        <div className={styles.nickname}>{player.nickname}</div>
        <div className={styles.power}>
          <img src={powerImage} alt={`${player.nickname}: ${player.power}`} />
          {player.power}
        </div>
      </div>
    </div>
  );
}
