import testVideoData from "../data/videos.json";

const videosFromYT = async (search_url) => {
  const YT_API_KEY = process.env.YT_API_KEY;
  const BASE_URL = "https://www.googleapis.com/youtube/v3";

  const url = `${BASE_URL}/${search_url}&maxResults=25&key=${YT_API_KEY}`;
  const res = await fetch(url);
  return await res.json();
};

export const getCommonVideos = async (search_url) => {
  try {
    const isDev = process.env.DEVELOPMENT;
    console.log(isDev);
    const data = isDev ? testVideoData : await videosFromYT(search_url);
    if (data.error) {
      console.log("error from videos.js", data.error.message);
      return [];
    }
    return data.items.map((item) => {
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        channel: item.snippet.channelTitle,
        publishedTime: item.snippet.publishedAt,
        description: item.snippet.description,
        viewCount: item.statistics ? item.statistics.viewCount : "not available",
      };
    });
  } catch (err) {
    console.log("error from videos.js", err);
    return [];
  }
};

export const getVideos = async (searchQuery) => {
  const SEARCH_URL = `search?part=snippet&q=${searchQuery}`;
  return await getCommonVideos(SEARCH_URL);
};

export const getPopularVideos = async (region) => {
  const SEARCH_URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=${region}`;
  return await getCommonVideos(SEARCH_URL);
};

export const getVideoById = async (videoId) => {
  const SEARCH_URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return await getCommonVideos(SEARCH_URL);
};
