import React from "react";
import Link from "next/link";
import Card from "./Card";
import styles from "./CardSection.module.css";

const CardSection = (props) => {
  const { title, videos, size, shouldWrap=false, shouldScale } = props;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      <div className={`${styles.cardWrapper} ${shouldWrap && styles.wrap}`}>
        {videos.map((video, idx) => (
          <Link href={`/video/${video.id}`} key={idx}>
            <a>
              <Card imgUrl={video.imgUrl} size={size} shouldScale={shouldScale}/>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CardSection;
