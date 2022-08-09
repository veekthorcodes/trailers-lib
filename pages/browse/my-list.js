import Head from "next/head";

import useVerifyTokenOrRedirectUser from "@utils/hooks/useVerifyTokenOrRedirectUser.js";
import LoadingSpinner from "@components/utils/LoadingSpinner";
import useLoadingState from "@utils/hooks/useLoadingState";
import CardSection from "@components/card/CardSection";
import { getMyListVideos } from "@utils/videos";
import Navbar from "@components/navbar/Navbar";
import styles from "@styles/MyList.module.css";

export async function getServerSideProps(context) {
  const { userId, token } = await useVerifyTokenOrRedirectUser(context);
  const myListVideos = await getMyListVideos(token, userId);
  return {
    props: {
      myListVideos,
    },
  };
}

const MyList = ({ myListVideos }) => {
  const loading = useLoadingState();
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      {loading && <LoadingSpinner />}
      <main className={styles.main}>
        <Navbar />

        <div className={styles.sectionWrapper}>
          <CardSection
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap={true}
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};
export default MyList;
