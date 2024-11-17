import React from "react";
import starFullImage from "src/components/ui/Cards/StarsComponent/starFull.svg";
import starEmptyImage from "src/components/ui/Cards/StarsComponent/starEmpty.svg";

export default function StarsComponent({ stars }) {
  function setStarsConfig(stars) {
    let starsConfig = [];
    for (let i = 0; i < stars; i++) {
      starsConfig.push(
        <img
          key={`full-${i}`}
          src={starFullImage}
          alt="star"
          style={{ marginRight: "5px" }}
        />
      );
    }
    for (let i = 0; i < 5 - stars; i++) {
      starsConfig.push(
        <img
          key={`empty-${i}`}
          src={starEmptyImage}
          alt="star"
          style={{ marginRight: "5px" }}
        />
      );
    }
    return starsConfig;
  }

  return <div style={{ display: "flex" }}>{setStarsConfig(stars)}</div>;
}
