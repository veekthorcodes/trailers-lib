import jwt from "jsonwebtoken";
import { isNewUser, createNewUser } from "@utils/db/hasura";
import { magicAdmin } from "@utils/magic-server";
import { setTokenCookie } from "@utils/cookies";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : "";
      const metaData = await magicAdmin.users.getMetadataByToken(didToken);
      const token = jwt.sign(
        {
          ...metaData,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metaData.issuer}`,
          },
        },
        process.env.JWT_SECRET
      );

      // Getting user info
      const isNewUserQuery = await isNewUser(token, metaData.issuer);

      isNewUserQuery && (await createNewUser(token, metaData));
      setTokenCookie(token, res);
      res.send({ done: true });
    } catch (error) {
      console.log("something went wrong loggin in", error);
      res.status(500).send({ message: "error loggin in" });
    }
  } else {
    res.send({ msg: "Not a POST request." });
  }
}
