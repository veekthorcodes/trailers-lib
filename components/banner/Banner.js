import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./Banner.module.css";

const Banner = (props) => {
  const { title, subTitle, imgUrl, videoId } = props;

  const router = useRouter();

  const playHandler = (e) => {
    e.preventDefault();
    router.push(`video/${videoId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroWrapper}>
        <div className={styles.hero}>
          <div className={styles.nseries}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.series}>S E R I E S</p>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <h2 className={styles.subTitle}>{subTitle}</h2>
          <div className={styles.playBtnWrapper}>
            <button onClick={playHandler} className={styles.playBtn}>
              <Image src="/static/play.svg" width="32px" height="32px" alt="Banner image" />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      ></div>
    </div>
  );
};

export default Banner;
