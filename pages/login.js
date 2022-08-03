import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import styles from "@styles/Login.module.css";

const login = () => {
  const [emailValid, setEmailValid] = useState("");
  const [email, setEmail] = useState("");

  const handleInputChange = (e) => {
    setEmailValid("")
    setEmail(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email.includes(["@", ".com"]) || email.length < 0) {
      setEmailValid("Please enter a valid email");
    }
  };
  return (
    <div>
      <Head>
        <title>Next-Flix Sign In</title>
      </Head>

      <div className={styles.container}>
        <Link href="/">
          <a>
            <div className={styles.logoWrapper}>Next-Flix</div>
          </a>
        </Link>

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
            <p className={styles.error}>{emailValid}</p>
            <button
              onClick={handleLogin}
              className={styles.loginBtn}
              
            >Log In</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default login;
