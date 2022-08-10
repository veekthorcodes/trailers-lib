import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { magic } from "@utils/magic-client";
import LoadingSpinner from "@components/utils/LoadingSpinner";
import "@styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRouteComple = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleRouteComple);

    return () => {
      router.events.off("routeChangeComplete", handleRouteComple);
    };
  }, [router.events]);

  useEffect(() => {
    const handleLogin = async () => {
      const loggedIn = await magic.user.isLoggedIn();
      if (loggedIn) {
        router.push("/");
      } else {
        router.push("/login");
      }
    };
    handleLogin();
  }, []);

  return isLoading ? <LoadingSpinner /> : <Component {...pageProps} />;
}

export default MyApp;
