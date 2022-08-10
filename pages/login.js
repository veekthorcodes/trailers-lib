import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "@styles/Login.module.css";
import LoadingSpinner from "@components/utils/LoadingSpinner";
import { magic } from "@utils/magic-client";
import { validateEmail } from "@utils/validate-email";

const login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleRouteComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleRouteComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, [router]);

  const handleInputChange = (e) => {
    setErrorMsg("");
    setEmail(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let emailValid = validateEmail(email);
    if (emailValid) {
      setIsLoading(true);
      try {
        const didToken = await magic.auth.loginWithMagicLink({ email });
        if (didToken) {
          const req = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "content-type": "application/json",
            },
          });

          const res = await req.json();
          if (res.done) {
            router.push("/");
          }
        }
      } catch (error) {
        setIsLoading(false);
      }
    } else {
      setErrorMsg("Invalid Email Address.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Trailers LiB Sign In</title>
      </Head>

      <div className={styles.container}>
        <a>
          <div className={styles.logoWrapper}>Trailers LiB</div>
        </a>

        <main className={styles.main}>
          <form className={styles.form}>
            <h1 className={styles.header}>Sign In</h1>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Enter email address"
              className={styles.input}
              value={email}
              onChange={handleInputChange}
            />
            <p className={styles.error}>{errorMsg}</p>
            <button onClick={handleLogin} className={styles.loginBtn}>
              {"Sign In"}
            </button>
            {isLoading && <LoadingSpinner />}
          </form>
        </main>
      </div>
    </div>
  );
};

export default login;
