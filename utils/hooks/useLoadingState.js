import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const useLoadingState = () => {
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

  return loading;
};

export default useLoadingState;
