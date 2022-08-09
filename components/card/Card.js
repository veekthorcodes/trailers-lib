import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import styles from "./Card.module.css";

const Card = (props) => {
  const {
    imgUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bW92aWV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    size = "medium",
    id,
    shouldScale=true
  } = props;
  const [imgSrc, setImgSrc] = useState(imgUrl);

  const scale = id === 0 ? { scaleX: 1.1 } : { scale: 1.1 };

  const shouldHover = shouldScale && {
    whileHover: {...scale}
  }

  const handleImgError = () => {
    setImgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bW92aWV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    );
  };

  const sizeMap = {
    large: styles.large,
    medium: styles.medium,
    small: styles.small,
  };
  return (
    <div className={styles.container}>
      <motion.div
        className={`${sizeMap[size]} + ${styles.imgMotionWrapper}`}
        {...shouldHover}
      >
        <Image
          src={imgSrc}
          layout="fill"
          className={styles.cardImg}
          onError={handleImgError}
        />
      </motion.div>
    </div>
  );
};

export default Card;
