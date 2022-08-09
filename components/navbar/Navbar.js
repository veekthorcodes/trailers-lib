import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import LoadingSpinner from "@components/utils/LoadingSpinner";
import { magic } from "@utils/magic-client";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState("Loading...");
  const [didToken, setDidToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { email } = await magic.user.getMetadata();
        const didToken = await magic.user.getIdToken();
        setUser(email);
        setDidToken(didToken);
      } catch (err) {
        console.error("could not get email", err);
      }
    };
    getUser();
  }, []);

  const handleNavHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleNavMyList = (e) => {
    e.preventDefault();
    router.push("browse/my-list");
  };

  const handleDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
    } catch (error) {
      setIsLoading(false);
      console.error("Error logging out", error);
      router.push("/login");
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/">
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>Next-Flix</div>
          </a>
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleNavHome}>
            Home
          </li>
          <li className={styles.navItem} onClick={handleNavMyList}>
            My List
          </li>
        </ul>

        <div className={styles.leftNavContainer}>
          <div>
            <button className={styles.userBtn} onClick={handleDropdown}>
              {user}
            </button>
            {showDropdown ? (
              <span className={styles.icon}>▲</span>
            ) : (
              <span className={styles.icon}>▼</span>
            )}
          </div>
          {showDropdown && (
            <div className={styles.navDropdown}>
              <a className={styles.linkName} onClick={handleLogout}>
                Sign Out
              </a>
            </div>
          )}
          {isLoading && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
