import videoData from "../data/videos.json";

export const getCommonVideos = async (search_url) => {
  const YT_API_KEY = process.env.YT_API_KEY;
  const BASE_URL = "https://www.googleapis.com/youtube/v3";

  const url = `${BASE_URL}/${search_url}&maxResults=25&key=${YT_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      return [];
    }

    return data.items.map((item) => {
      return {
        id: item.id,
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        channel: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
      };
    });
  } catch (error) {
    console.log(error);
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
