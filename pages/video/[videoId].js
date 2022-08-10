import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";

import LoadingSpinner from "@components/utils/LoadingSpinner";
import Navbar from "@components/navbar/Navbar";
import DisLike from "@components/icons/Dislike";
import Like from "@components/icons/Like";
import styles from "@styles/Video.module.css";
import { getVideoById } from "@utils/videos";
import useLoadingState from "@utils/hooks/useLoadingState";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  const videoId = context.params.videoId;
  const videos = await getVideoById(videoId);
  const video = videos.filter((video) => {
    return video.id === videoId;
  });
  return {
    props: {
      video: video.length > 0 ? video[0] : {},
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const videoIds = ["Yj0l7iGKh8g", "ia1Fbg96vL0", "sj9J2ecsSpo", "nW948Va-l10"];
  const paths = videoIds.map((videoId) => {
    return { params: { videoId } };
  });

  return { paths, fallback: true };
}

const Video = ({ video }) => {
  const router = useRouter();
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);
  const videoId = router.query.videoId;
  const loading = useLoadingState();

  const { title, publishTime, description, channel, viewCount } = video;

  useEffect(() => {
    const videoData = async () => {
      const res = await fetch(`/api/stats?videoId=${videoId}`);
      const data = await res.json();
      if (data.video) {
        data?.video[0]?.favorite ? setToggleLike(true) : setToggleDislike(true);
      }
    };
    videoData();
  }, [videoId]);

  const handleLike = async () => {
    setToggleLike(!toggleLike);
    setToggleDislike(false);
    const res = await fetch("/api/stats", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        watched: true,
        favorite: !toggleLike,
      }),
    });
  };

  const handleDisLike = async () => {
    setToggleLike(false);
    setToggleDislike(!toggleDislike);
    const res = await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        watched: true,
        favorite: false,
      }),
    });
  };

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
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
          frameBorder="0"
          className={styles.videoPlayer}
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <button onClick={handleLike}>
            <div className={styles.btnWrapper}>
              <Like selected={toggleLike} />
            </div>
          </button>
          <button onClick={handleDisLike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDislike} />
            </div>
          </button>
        </div>

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
