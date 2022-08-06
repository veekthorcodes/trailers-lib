import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";

import Navbar from "@components/navbar/Navbar";
import LoadingSpinner from "@components/utils/LoadingSpinner";
import styles from "@styles/Video.module.css";
import { getVideoById } from "@utils/videos";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  const videoId = context.params.videoId;
  console.log(videoId)
  const videos = await getVideoById(videoId);

  const video = videos.filter((video) => video.id === videoId);
  console.log(video)

  return {
    props: { videos: videos.length > 0 ? video[0] : {} },
  };
}

export async function getStaticPaths() {
  const videoIds = ["Yj0l7iGKh8g", "ia1Fbg96vL0", "sj9J2ecsSpo", "nW948Va-l10"];
  const paths = videoIds.map((videoId) => {
    return { params: { videoId } };
  });

  return { paths, fallback: true };
}

const Video = ({ videos }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
    };
    const handleRouteComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, []);

  const { title, publishTime, description, channel, viewCount } = videos;
  return (
    <div>
      {loading && <LoadingSpinner />}
      <Navbar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        overlayClassName={styles.overlay}
        className={styles.modal}
      >
        <iframe
          id="ytplayer"
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
          frameBorder="0"
          className={styles.videoPlayer}
        ></iframe>

        <div className={styles.modalBody}>
          <div className={styles.detail}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.publishTime}>{publishTime}</p>
            <p className={styles.description}>{description}</p>
          </div>
          <div>
            <p className={styles.subDetail}>
              <span className={styles.subDetailKey}>Channel: </span>
              <span className={styles.subDetailText}>{channel}</span>
            </p>
            <p className={styles.subDetail}>
              <span className={styles.subDetailKey}>Views: </span>
              <span className={styles.subDetailText}>{viewCount}</span>
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
