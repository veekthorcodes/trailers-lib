async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "applicatoin/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users (where: {issuer: {_eq: $issuer}}) {
        email
        id
        issuer
        publicAddress
      }
    }
  `;

  const res = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    { issuer },
    token
  );
  return res?.data?.users?.length === 0;
}

export async function createNewUser(token, metaData) {
  const operationsDoc = `
    mutation createNewUser($email: String!, $issuer: String!, $publicAddress: String!) {
      insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
        returning {
          email
          id
          issuer
        }
      }
    }
  `;

  const { email, issuer, publicAddress } = metaData;

  const res = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    { email, issuer, publicAddress },
    token
  );
  return res?.data?.users?.length === 0;
}

export async function findVideoIdbyUserId(token, userId, videoId) {
  const operationsDoc = `
    query findVideoIdbyUserId($userId: String!, $videoId: String!) {
      stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
        id
        userId
        videoId
        favorite
        watched
      }
    }
  `;

  const res = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdbyUserId",
    { userId, videoId },
    token
  );
  return res?.data?.stats;
}

export async function updateStats({
  token,
  userId,
  videoId,
  watched,
  favorite,
}) {
  const operationsDoc = `
    mutation updateStats($favorite: Boolean!, $watched: Boolean!, $userId: String!, $videoId: String!){
      update_stats(
        _set: {watched: $watched, favorite: $favorite},
        where: {
          userId: {_eq: $userId},
          videoId: {_eq: $videoId}
        }
      ) {
        returning {
          userId
          videoId
          favorite
          watched
        }
      }
    }
  `;

  const res = await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    {
      userId,
      videoId,
      watched,
      favorite,
    },
    token
  );
  return res;
}

export async function insertStats({
  token,
  userId,
  videoId,
  watched,
  favorite,
}) {
  const operationsDoc = `
    mutation insertStats($userId: String!, $videoId: String!, $watched: Boolean!, $favorite: Boolean!) {
      insert_stats_one(object: {
        userId: $userId,
        videoId: $videoId,
        watched: $watched,
        favorite: $favorite
      }) {
        watched
        favorite
      }
    }
  `;

  return await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    { userId, videoId, watched, favorite },
    token
  );
}

export async function watchedVideos(token, userId) {
  const operationsDoc = `
    query watchedVideos($userId: String!) {
      stats(where: {
        watched: {_eq: true},
        userId: {_eq: $userId},
      }) {
        videoId
      }
    }
  `;

  const res = await queryHasuraGQL(
    operationsDoc,
    "watchedVideos",
    { userId },
    token
  );
  return res?.data?.stats;
}

export async function myListVideos(token, userId) {
  const operationsDoc = `
    query myListVideos($userId: String!) {
      stats(where: {
        favorite: {_eq: true},
        userId: {_eq: $userId}
      }) {
        videoId
      }
    }
  `;
  const res = await queryHasuraGQL(
    operationsDoc,
    "myListVideos",
    { userId },
    token
  );
  return res?.data?.stats;
}
