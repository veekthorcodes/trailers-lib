import React from "react";

import Card from "./Card";
import styles from "./CardSection.module.css";

const CardSection = (props) => {
  const { title, videos, size } = props;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.cardWrapper}>
        {videos.map((video) => (
          <Card imgUrl={video.imgUrl} size={size} />
        ))}
      </div>
    </div>
  );
};

export default CardSection;
